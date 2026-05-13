import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { generateRepaymentSchedule, getRepaymentSchedule } from '../services/repayment';
import { db } from '../config/firebase';

const router = Router();

// Generate repayment schedule for a loan
router.post('/:loanId/generate', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const existing = await getRepaymentSchedule(req.orgId!, req.params.loanId);
    if (existing) {
      return res.status(400).json({ error: 'Schedule already exists for this loan' });
    }

    const scheduleId = await generateRepaymentSchedule(req.orgId!, req.params.loanId);
    res.status(201).json({ id: scheduleId, message: 'Repayment schedule generated' });
  } catch (error: any) {
    console.error('Error generating schedule:', error);
    res.status(500).json({ error: error.message || 'Failed to generate schedule' });
  }
});

// Get repayment schedule for a loan
router.get('/:loanId', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const schedule = await getRepaymentSchedule(req.orgId!, req.params.loanId);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.status(200).json(schedule);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ error: 'Failed to get schedule' });
  }
});

export default router;
