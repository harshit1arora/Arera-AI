import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
const Razorpay = require('razorpay');
import crypto from 'crypto';
import { db } from '../config/firebase';

const router = Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey12345',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret67890',
});

// Create Order
router.post('/create-order', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.orgId!;
    
    // ₹25,000 upgrade fee = 2500000 paise
    const options = {
      amount: 2500000, 
      currency: "INR",
      receipt: `receipt_${orgId}_${Date.now()}`
    };
    
    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

// Verify Payment
router.post('/verify', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.orgId!;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mocksecret67890';
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is valid, upgrade org to Enterprise
      await db.collection('usage_stats').doc(orgId).update({
        tier: 'enterprise',
        updatedAt: new Date()
      });

      res.status(200).json({ success: true, message: 'Upgraded to Enterprise successfully' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get Usage
router.get('/usage', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orgId = req.orgId!;
    const usageDoc = await db.collection('usage_stats').doc(orgId).get();
    
    if (!usageDoc.exists) {
      return res.status(200).json({ tier: 'startup', apiCalls: 0, limit: 100 });
    }
    
    res.status(200).json(usageDoc.data());
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    res.status(500).json({ error: 'Failed to fetch usage stats' });
  }
});

export default router;
