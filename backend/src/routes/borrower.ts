import { Router, Response, Request } from 'express';
import { db } from '../config/firebase';

import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

// Mock OTP send
router.post('/send-otp', async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Valid phone required' });
  }
  // In production, integrate Twilio/AWS SNS here
  console.log(`[OTP] Sending OTP to ${phone}`);
  res.status(200).json({ success: true });
});

// Generate a secure JWT after verifying OTP
router.post('/login', async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP required' });
  }

  // In production, verify OTP via SMS provider. MVP trusts any 4-digit OTP.
  if (otp.length < 4) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  const token = jwt.sign({ phone }, JWT_SECRET, { expiresIn: '7d' });
  res.status(200).json({ token });
});

// Authenticate via signed JWT
const jwtBorrowerAuth = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  
  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).borrowerPhone = decoded.phone;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Get all loans for the logged-in borrower
router.get('/me/loans', jwtBorrowerAuth, async (req: Request, res: Response) => {
  try {
    const phone = (req as any).borrowerPhone;
    
    // Fetch loans matching phone number across all orgs (in a real system, there might be a borrower_users collection)
    const snapshot = await db.collection('loans')
      .where('borrowerPhone', '==', phone)
      .get();
      
    const loans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // For each loan, fetch the repayment schedule
    for (const loan of loans) {
      const scheduleSnap = await db.collection('repayment_schedules')
        .where('loanId', '==', loan.id)
        .limit(1)
        .get();
        
      if (!scheduleSnap.empty) {
        (loan as any).schedule = scheduleSnap.docs[0].data().schedules;
      }
    }

    res.status(200).json(loans);
  } catch (error) {
    console.error('Error fetching borrower loans:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
});

// Borrower action: request prepayment
router.post('/me/loans/:loanId/prepay', jwtBorrowerAuth, async (req: Request, res: Response) => {
  try {
    const phone = (req as any).borrowerPhone;
    const { amount } = req.body;
    
    const doc = await db.collection('loans').doc(req.params.loanId).get();
    if (!doc.exists || doc.data()?.borrowerPhone !== phone) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    
    // Just mock logging the prepayment intent
    res.status(200).json({ success: true, message: `Prepayment request for ₹${amount} logged. Support will contact you.` });
  } catch (error) {
    console.error('Error requesting prepayment:', error);
    res.status(500).json({ error: 'Failed to request prepayment' });
  }
});

export default router;
