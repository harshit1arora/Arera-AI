import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import {
  createLoan,
  getLoan,
  listLoans,
  getLoansByApplicationId,
  updateLoanStatus,
  updateLoanNPAStatus,
  updateLoanFinancials,
  linkDisbursementToLoan,
  getLoanPortfolioMetrics,
} from '../services/loans';

const router = Router();

// Get all loans with filters
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const segment = req.query.segment as string | undefined;
    const npaStatus = req.query.npaStatus as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 500;

    const loans = await listLoans(req.orgId!, {
      status: status as any,
      segment,
      npaStatus,
      limit,
    });

    res.status(200).json(loans);
  } catch (error) {
    console.error('Error listing loans:', error);
    res.status(500).json({ error: 'Failed to list loans' });
  }
});

// Get specific loan
router.get('/:loanId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const loan = await getLoan(req.orgId!, req.params.loanId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    res.status(200).json(loan);
  } catch (error) {
    console.error('Error getting loan:', error);
    res.status(500).json({ error: 'Failed to get loan' });
  }
});

// Get loan by application ID
router.get('/application/:applicationId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const loan = await getLoansByApplicationId(req.orgId!, req.params.applicationId);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found for this application' });
    }

    res.status(200).json(loan);
  } catch (error) {
    console.error('Error getting loan by application ID:', error);
    res.status(500).json({ error: 'Failed to get loan' });
  }
});

// Create new loan from approved application
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      applicationId,
      borrowerId,
      borrowerName,
      borrowerPhone,
      borrowerEmail,
      loanAmount,
      interestRate,
      tenor,
      productId,
      productName,
      segment,
    } = req.body;

    // Validate required fields
    if (!applicationId || !borrowerId || !borrowerName || !loanAmount || !tenor) {
      return res.status(400).json({
        error: 'applicationId, borrowerId, borrowerName, loanAmount, and tenor are required',
      });
    }

    // Calculate EMI and interest
    const monthlyRate = interestRate / 100 / 12;
    const emiAmount = Math.round(
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenor)) /
      (Math.pow(1 + monthlyRate, tenor) - 1)
    );
    const principalAmount = loanAmount;
    const interestAmount = emiAmount * tenor - loanAmount;

    const loanId = await createLoan(req.orgId!, {
      applicationId,
      orgId: req.orgId!,
      borrowerId,
      borrowerName,
      borrowerPhone,
      borrowerEmail,
      loanAmount,
      interestRate,
      tenor,
      productId: productId || 'default',
      productName: productName || 'Standard Loan',
      segment: segment || 'Consumer',
      status: 'Created',
      currentStage: 'application',
      emiAmount,
      principalAmount,
      interestAmount,
      totalDisbursed: 0,
      totalRepaid: 0,
      outstandingAmount: loanAmount,
      timeline: [],
      customFields: req.body.customFields || {},
    });

    res.status(201).json({
      id: loanId,
      message: 'Loan created successfully',
    });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ error: 'Failed to create loan' });
  }
});

// Update loan status
router.post('/:loanId/update-status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, stage, notes, actor } = req.body;

    if (!status || !stage) {
      return res.status(400).json({ error: 'status and stage are required' });
    }

    await updateLoanStatus(req.orgId!, req.params.loanId, status, stage, notes, actor);

    res.status(200).json({ success: true, message: 'Loan status updated' });
  } catch (error) {
    console.error('Error updating loan status:', error);
    res.status(500).json({ error: 'Failed to update loan status' });
  }
});

// Update NPA status
router.post('/:loanId/mark-npa', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { daysOverdue, npaStatus } = req.body;

    if (typeof daysOverdue !== 'number' || !npaStatus) {
      return res.status(400).json({ error: 'daysOverdue and npaStatus are required' });
    }

    await updateLoanNPAStatus(req.orgId!, req.params.loanId, daysOverdue, npaStatus);

    res.status(200).json({ success: true, message: 'Loan NPA status updated' });
  } catch (error) {
    console.error('Error updating NPA status:', error);
    res.status(500).json({ error: 'Failed to update NPA status' });
  }
});

// Update loan financials
router.post('/:loanId/update-financials', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { totalRepaid, outstandingAmount } = req.body;

    if (typeof totalRepaid !== 'number' || typeof outstandingAmount !== 'number') {
      return res.status(400).json({ error: 'totalRepaid and outstandingAmount are required' });
    }

    await updateLoanFinancials(req.orgId!, req.params.loanId, totalRepaid, outstandingAmount);

    res.status(200).json({ success: true, message: 'Loan financials updated' });
  } catch (error) {
    console.error('Error updating financials:', error);
    res.status(500).json({ error: 'Failed to update financials' });
  }
});

// Link disbursement to loan
router.post('/:loanId/link-disbursement', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { disbursementId } = req.body;

    if (!disbursementId) {
      return res.status(400).json({ error: 'disbursementId is required' });
    }

    await linkDisbursementToLoan(req.orgId!, req.params.loanId, disbursementId);

    res.status(200).json({ success: true, message: 'Disbursement linked to loan' });
  } catch (error) {
    console.error('Error linking disbursement:', error);
    res.status(500).json({ error: 'Failed to link disbursement' });
  }
});

// Get portfolio metrics
router.get('/metrics/portfolio', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const metrics = await getLoanPortfolioMetrics(req.orgId!);
    res.status(200).json(metrics);
  } catch (error) {
    console.error('Error getting portfolio metrics:', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

export default router;
