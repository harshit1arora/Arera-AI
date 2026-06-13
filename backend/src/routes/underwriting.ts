import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { enforceQuota } from '../middleware/quota';
import { db } from '../config/firebase';
import { analyze } from '../services/underwriting-engine';
import { validateAnalyzeRequest } from '../services/underwriting-validator';
import { loadPilotPolicy } from '../config/policy-loader';
import { AnalysisResult } from '../types/underwriting';

const router = Router();

const IDEMPOTENCY_COLLECTION = 'underwriting_idempotency';
const AUDIT_COLLECTION = 'audit_logs';

const idKeyDoc = (orgId: string, key: string) =>
  `${orgId}__${key}`.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 256);

/**
 * Idempotency replay (runs BEFORE enforceQuota so a retry is never re-billed).
 * On a hit we return the stored result verbatim — no new audit row, no charge.
 */
const idempotencyReplay = async (
  req: AuthenticatedRequest,
  res: Response,
  next: () => void,
) => {
  const key = req.header('Idempotency-Key');
  if (!key) return next();
  try {
    const orgId = req.orgId!;
    const snap = await db.collection(IDEMPOTENCY_COLLECTION).doc(idKeyDoc(orgId, key)).get();
    if (snap.exists) {
      const stored = snap.data() as { result?: AnalysisResult };
      if (stored?.result) {
        res.setHeader('Idempotent-Replay', 'true');
        return res.status(200).json(stored.result);
      }
    }
    next();
  } catch (err) {
    console.error('Idempotency lookup error:', err);
    // Fail-open to evaluation rather than blocking a real request.
    next();
  }
};

/**
 * @openapi
 * /underwriting/analyze:
 *   post:
 *     summary: Underwrite a loan application from bank-statement transactions
 *     description: >
 *       Runs the tuned, deterministic policy engine over normalized transaction
 *       JSON and returns APPROVE / REJECT / REVIEW with a credit limit, risk
 *       score, weighted reasons and the full per-rule ledger. Any completed
 *       analysis returns 200 — including a data-insufficiency (E001) reject.
 *       Send an `Idempotency-Key` header to make retries safe (deduped per org).
 *     tags: [Underwriting]
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         schema: { type: string }
 *         required: false
 *     responses:
 *       200: { description: Analysis completed (APPROVE / REVIEW / REJECT) }
 *       400: { description: Malformed payload / bad PAN / non-JSON body }
 *       401: { description: Missing or invalid API key }
 *       429: { description: Quota exceeded }
 */
router.post(
  '/analyze',
  idempotencyReplay,
  enforceQuota,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orgId = req.orgId!;

      // Non-JSON bodies (e.g. a raw PDF upload) → transport fault, not a decision.
      if (!req.is('application/json')) {
        return res.status(400).json({
          error: {
            code: 'E400',
            message: 'Unsupported content type — application/json required',
            detail:
              'PDFs must be normalized via POST /v1/parse/bank-statement first; submit the returned transactions JSON here.',
          },
        });
      }

      const validation = validateAnalyzeRequest(req.body);
      if (!validation.ok || !validation.input) {
        return res.status(400).json({ error: validation.error });
      }

      const { policy, hash } = loadPilotPolicy();
      const { result, signals } = analyze(validation.input, policy);

      // ── Immutable audit row (RBI defensibility / exact replay) ─────────
      const idemKey = req.header('Idempotency-Key') || null;
      const pan = String(validation.input.applicant.pan).toUpperCase();
      await db.collection(AUDIT_COLLECTION).add({
        orgId,
        action: 'UNDERWRITING_ANALYZED',
        targetId: result.audit_id,
        detail: `Decision: ${result.decision}, Score: ${result.risk_score}, Limit: ${result.credit_limit}`,
        actor: 'underwriting_engine',
        timestamp: new Date(),
        rbiComplianceFields: {
          audit_id: result.audit_id,
          decision: result.decision,
          risk_score: result.risk_score,
          credit_limit: result.credit_limit,
          rules_fired: result.rules_fired,
          signals,
          panMasked: '******' + pan.slice(-4),
          reviewerId: req.apiKeyId || req.uid || 'system',
          policyId: policy.policy_id,
          policyVersion: policy.version,
          policyHash: hash,
          idempotencyKey: idemKey,
        },
      });

      // ── Settle the idempotency key so retries replay this exact result ──
      if (idemKey) {
        await db
          .collection(IDEMPOTENCY_COLLECTION)
          .doc(idKeyDoc(orgId, idemKey))
          .set({
            orgId,
            audit_id: result.audit_id,
            result,
            createdAt: new Date(),
          });
      }

      return res.status(200).json(result);
    } catch (err) {
      console.error('Underwriting analyze error:', err);
      return res.status(500).json({
        error: { code: 'E500', message: 'Internal error during underwriting analysis' },
      });
    }
  },
);

export default router;
