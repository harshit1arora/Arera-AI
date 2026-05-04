import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/firebase';
import { dispatchWebhook } from '../services/webhooks';
import crypto from 'crypto';

const router = Router();

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const doc = await db.collection('webhooks').doc(req.orgId!).get();
    if (!doc.exists) {
      return res.status(200).json({ targetUrl: '', isActive: false });
    }
    // Never expose the secret key to the client
    const { targetUrl, isActive, updatedAt } = doc.data()!;
    return res.status(200).json({ targetUrl, isActive, updatedAt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch webhook config' });
  }
});

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetUrl } = req.body;
    if (typeof targetUrl !== 'string') {
      return res.status(400).json({ error: 'targetUrl string is required' });
    }

    // Validate URL format
    try { new URL(targetUrl); } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Generate cryptographically secure signing key
    const secretKey = `whsec_${crypto.randomBytes(24).toString('hex')}`;

    const payload = {
      targetUrl,
      isActive: targetUrl.length > 0,
      secretKey,
      updatedAt: new Date()
    };

    await db.collection('webhooks').doc(req.orgId!).set(payload, { merge: true });

    // Audit log
    await db.collection('audit_logs').add({
      orgId: req.orgId,
      action: 'WEBHOOK_CONFIGURED',
      detail: `Endpoint set to ${targetUrl}`,
      timestamp: new Date()
    });

    // Return secret key ONCE (Show Once protocol)
    res.status(200).json({
      targetUrl: payload.targetUrl,
      isActive: payload.isActive,
      signingSecret: secretKey, // Shown once, client must store it
      updatedAt: payload.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update webhook config' });
  }
});

router.post('/test', async (req: AuthenticatedRequest, res: Response) => {
  try {
    await dispatchWebhook(req.orgId!, 'ping.test', {
      message: "Webhook pipeline connection verified.",
      status: "Operational"
    });
    
    res.status(200).json({ success: true, message: "Test payload dispatched." });
  } catch (error) {
    res.status(500).json({ error: 'Failed to dispatch test payload' });
  }
});

export default router;
