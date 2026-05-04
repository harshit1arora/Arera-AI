import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { getPortfolioAnalytics } from '../services/analytics';

const router = Router();

/**
 * @api {get} /v1/analytics/portfolio Get Portfolio Analytics
 * Returns real-time aggregated metrics from live application and monitoring data.
 */
router.get('/portfolio', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.orgId!;
    const analytics = await getPortfolioAnalytics(orgId);
    res.status(200).json(analytics);
  } catch (error) {
    console.error('Analytics API Error:', error);
    res.status(500).json({ error: 'Internal server error aggregating analytics' });
  }
});

export default router;
