import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { fetchBureauData } from '../services/bureau';
import { dispatchWebhook } from '../services/webhooks';

const router = Router();

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.orgId!;
    const { applicantName, panNumber, annualIncome, loanAmount, creditDebt, applicationId } = req.body;

    if (!applicantName || !panNumber || !annualIncome || !loanAmount) {
      return res.status(400).json({ error: 'Missing required fields: applicantName, panNumber, annualIncome, loanAmount' });
    }

    // Validate types
    if (typeof annualIncome !== 'number' || typeof loanAmount !== 'number') {
      return res.status(400).json({ error: 'annualIncome and loanAmount must be numbers' });
    }

    if (loanAmount <= 0 || annualIncome <= 0) {
      return res.status(400).json({ error: 'annualIncome and loanAmount must be positive' });
    }

    // PAN format validation (basic Indian PAN: 5 alpha + 4 digit + 1 alpha)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panNumber.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid PAN number format' });
    }

    // 1. Persist application
    let appRef;
    const appData = {
      orgId,
      applicantName: String(applicantName).trim(),
      annualIncome: Number(annualIncome),
      loanAmount: Number(loanAmount),
      creditDebt: Number(creditDebt || 0),
      status: 'Pending' as const,
      aiScore: null,
      aiReasoning: null,
      createdAt: new Date(),
      decidedAt: null,
    };

    if (applicationId) {
      appRef = db.collection('applications').doc(applicationId);
      await appRef.set(appData, { merge: true });
    } else {
      appRef = await db.collection('applications').add(appData);
    }

    // 2. Fetch Bureau Data
    const bureauData = await fetchBureauData(panNumber, loanAmount);

    // 3. Engine Evaluation (Risk Policies)
    const policiesQuery = await db.collection('policies').where('orgId', '==', orgId).limit(1).get();
    
    let status = 'Manual Review';
    let usedRule = 'Default fallthrough logic.';
    
    if (!policiesQuery.empty) {
      const policyData = policiesQuery.docs[0].data();
      
      const checkRules = (rules: any[]) => {
        if (!rules || !Array.isArray(rules)) return false;
        for (let rule of rules) {
           if (!rule.field || !rule.op || rule.value === undefined) continue;

           let evalVal: number = 0;
           if (rule.field === 'bureau_score') evalVal = bureauData.score;
           if (rule.field === 'loan_amount') evalVal = Number(loanAmount);
           if (rule.field === 'annual_income') evalVal = Number(annualIncome);
           
           let rulePasses = false;
           const ruleVal = parseFloat(rule.value);
           if (isNaN(ruleVal)) continue;

           if (rule.op === '>') rulePasses = evalVal > ruleVal;
           else if (rule.op === '<') rulePasses = evalVal < ruleVal;
           else if (rule.op === '>=') rulePasses = evalVal >= ruleVal;
           else if (rule.op === '<=') rulePasses = evalVal <= ruleVal;
           else if (rule.op === '===') rulePasses = evalVal === ruleVal;
           
           if (rulePasses) {
             usedRule = rule.description || `Rule match: ${rule.field} ${rule.op} ${rule.value}`;
             return true;
           }
        }
        return false;
      };

      if (bureauData.signals.fraudFlagsDetected) {
         status = 'Rejected';
         usedRule = 'Hard reject: Fraud signals detected across bureau networks.';
      } else if (checkRules(policyData['auto-reject'])) {
        status = 'Rejected';
      } else if (checkRules(policyData['auto-approve'])) {
        status = 'Approved';
      } else if (checkRules(policyData['manual-review'])) {
        status = 'Manual Review';
      }
    } else {
      if (bureauData.signals.fraudFlagsDetected) status = 'Rejected';
      else if (bureauData.score >= 700) status = 'Approved';
      else if (bureauData.score < 600) status = 'Rejected';
    }

    const aiReasoning = `Engine Rule: [${usedRule}]. Bureau → Score: ${bureauData.score}, DTI High: ${bureauData.signals.dtiRatioHigh ? 'Yes' : 'No'}, Stable History: ${bureauData.signals.bureauHitStable ? 'Yes' : 'No'}, Income Verified: ${bureauData.signals.incomeVerified ? 'Yes' : 'No'}.`;

    // 4. Update Database with decision timestamp
    await appRef.update({
      aiScore: bureauData.score,
      status,
      aiReasoning,
      decidedAt: new Date(),
    });

    // 5. Audit Log
    await db.collection('audit_logs').add({
      orgId,
      action: 'APPLICATION_EVALUATED',
      targetId: appRef.id,
      detail: `Status: ${status}, Score: ${bureauData.score}, Rule: ${usedRule}`,
      actor: 'system_ai',
      timestamp: new Date()
    });

    // 6. Fire Webhook (async, non-blocking)
    dispatchWebhook(orgId, 'application.evaluated', {
      applicationId: appRef.id,
      status,
      score: bureauData.score,
      signals: bureauData.signals
    });

    res.status(200).json({
      applicationId: appRef.id,
      status,
      aiScore: bureauData.score,
      reasoning: aiReasoning
    });

  } catch (error) {
    console.error('Evaluate API Error:', error);
    res.status(500).json({ error: 'Internal server error during evaluation' });
  }
});

export default router;
