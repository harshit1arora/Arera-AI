import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { authenticateApiToken, authenticateFirebaseToken } from './middleware/auth';
import evaluateRouter from './routes/evaluate';
import apikeysRouter from './routes/apikeys';
import policiesRouter from './routes/policies';
import webhooksRouter from './routes/webhooks';
import sentinelRouter from './routes/sentinel';
import analyticsRouter from './routes/analytics';
import systemRouter from './routes/system';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ── Security Hardening ─────────────────────────────────────────────
app.use(helmet()); // Sets secure HTTP headers (X-Frame-Options, CSP, etc.)

// CORS: Locked to specific origins
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS: Origin not allowed'), false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' })); // Cap request body size

// ── Rate Limiting ──────────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute window
  max: 100,               // 100 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded. Please slow down.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 20,                   // 20 key generation attempts per 15 min
  message: { error: 'Too many authentication attempts. Try again later.' },
});

app.use('/v1', apiLimiter);
app.use('/v1/apikeys', authLimiter);

// ── Health Check (public) ──────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'arera-api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ── Admin Routes (Secured by Firebase ID Tokens) ───────────────────
// apikeys router handles its own auth internally (authenticateFirebaseToken)
app.use('/v1/apikeys', apikeysRouter);

// ── Protected API Routes (Secured by API Keys) ────────────────────
app.use('/v1/evaluate', authenticateApiToken, evaluateRouter);
app.use('/v1/policies', authenticateApiToken, policiesRouter);
app.use('/v1/webhooks', authenticateApiToken, webhooksRouter);
app.use('/v1/sentinel', authenticateApiToken, sentinelRouter);
app.use('/v1/analytics', authenticateApiToken, analyticsRouter);
app.use('/v1/system', authenticateApiToken, systemRouter);

// ── Global Error Handler ───────────────────────────────────────────
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Arera AI API Gateway running on port ${PORT}`);
});
