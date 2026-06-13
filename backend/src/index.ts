import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger';
import { authenticateApiToken, authenticateFirebaseToken, authenticateAnyToken } from './middleware/auth';
import { enforceQuota } from './middleware/quota';
import evaluateRouter from './routes/evaluate';
import apikeysRouter from './routes/apikeys';
import policiesRouter from './routes/policies';
import webhooksRouter from './routes/webhooks';
import { processWebhookQueue } from './services/webhooks';
import sentinelRouter from './routes/sentinel';
import analyticsRouter from './routes/analytics';
import systemRouter from './routes/system';
import disbursementsRouter from './routes/disbursements';
import bankAccountsRouter from './routes/bank-accounts';
import communicationsRouter from './routes/communications';
import loansRouter from './routes/loans';
import productsRouter from './routes/products';
import repaymentsRouter from './routes/repayment';
import collectionsRouter from './routes/collections';
import reportingRouter from './routes/reporting';
import borrowerRouter from './routes/borrower';
import billingRouter from './routes/billing';
import copilotRouter from './routes/copilot';
import applicationsRouter from './routes/applications';
import agentsRouter from './routes/agents';
import portfolioRouter from './routes/portfolio';
import complianceRouter from './routes/compliance';
import complianceRbiRouter from './routes/compliance-rbi';
import aiEvaluationRouter from './routes/ai-evaluation';
import workflowAutomationRouter from './routes/workflow-automation';
import automatedKycRouter from './routes/automated-kyc';
import automatedDisbursementRouter from './routes/automated-disbursement';
import notificationsRouter from './routes/notifications';
import paymentsRouter from './routes/payments';
import pdfParserRouter from './routes/pdf-parser';
import auditLogRouter from './routes/audit-log';
import salesRouter from './routes/sales';
import roiRouter from './routes/roi';
import bureauRouter from './routes/bureau';
import evaluationRouter from './routes/evaluation';
import slackAlertsRouter from './routes/slack-alerts';
import statementAnalysisRouter from './routes/statement-analysis';
import predictionRouter from './routes/prediction';
import enhancedBureauRouter from './routes/enhanced-bureau';
import lenderMatchingRouter from './routes/lender-matching';
import publicPredictionRouter from './routes/public-prediction';
import originationRouter from './routes/origination';
import underwritingRouter from './routes/underwriting';
import { connectRedis } from './services/redis';
import { runDailyCollectionCheck } from './services/collection-automation';
import { runPortfolioClassification } from './services/compliance-engine';

dotenv.config();

// Initialize Redis connection
connectRedis().then(client => {
  if (client) {
    console.log('✅ Redis connected for workflow state management');
  } else {
    console.log('⚠️  Using in-memory fallback for workflows');
  }
}).catch(err => {
  console.warn('Redis initialization failed:', err.message);
});

const app = express();
const PORT = process.env.PORT || 8080;

// ── Security Hardening ─────────────────────────────────────────────
app.use(helmet()); // Sets secure HTTP headers (X-Frame-Options, CSP, etc.)

// CORS: Locked to specific origins
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://tryarera.com,https://www.tryarera.com').split(',');
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

app.use(express.json({ limit: '10mb' }));

// Disable X-Powered-By header
app.disable('x-powered-by');

// ── Request Validation Middleware ───────────────────────────────────────
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    return res.status(413).json({ error: 'Request body too large' });
  }
  next();
});

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

// ── API Documentation (Public) ─────────────────────────────────────
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { customSiteTitle: "Arera API Docs" }));

// ── Public B2C Routes (No Auth Required) ────────────────────────────
app.use('/v1/public', publicPredictionRouter);
app.use('/v1/public/lenders', lenderMatchingRouter);

// ── Admin Routes (Secured by Firebase ID Tokens) ───────────────────
// apikeys router handles its own auth internally (authenticateFirebaseToken)
app.use('/v1/apikeys', apikeysRouter);

// ── Protected API Routes (Secured by API or Firebase Tokens) ────────
app.use('/v1/evaluate', authenticateAnyToken, evaluateRouter);
app.use('/v1/underwriting', authenticateAnyToken, underwritingRouter);
app.use('/v1/policies', authenticateAnyToken, policiesRouter);
app.use('/v1/billing', authenticateAnyToken, billingRouter);
app.use('/v1/copilot', authenticateAnyToken, copilotRouter);
app.use('/v1/analytics', authenticateAnyToken, analyticsRouter);
app.use('/v1/system', authenticateAnyToken, systemRouter);
app.use('/v1/disbursements', authenticateAnyToken, disbursementsRouter);
app.use('/v1/bank-accounts', authenticateAnyToken, bankAccountsRouter);
app.use('/v1/communications', authenticateAnyToken, communicationsRouter);
// Razorpay webhook - needs raw body for signature verification
app.post('/v1/webhooks/razorpay', express.raw({ type: 'application/json' }), webhooksRouter);
app.use('/v1/sentinel', authenticateAnyToken, sentinelRouter);
app.use('/v1/loans', authenticateAnyToken, loansRouter);
app.use('/v1/products', authenticateAnyToken, productsRouter);
app.use('/v1/repayments', authenticateAnyToken, repaymentsRouter);
app.use('/v1/collections', authenticateAnyToken, collectionsRouter);
app.use('/v1/origination', authenticateAnyToken, originationRouter);
app.use('/v1/reports', authenticateAnyToken, reportingRouter);

// Borrower API (Custom Auth inside)
app.use('/v1/borrower', borrowerRouter);

// New Feature Routes
app.use('/v1/applications', authenticateAnyToken, applicationsRouter);
app.use('/v1/agents', authenticateAnyToken, agentsRouter);
app.use('/v1/portfolio', authenticateAnyToken, portfolioRouter);
app.use('/v1/compliance', authenticateAnyToken, complianceRouter);
app.use('/v1/rbi', authenticateAnyToken, complianceRbiRouter);
app.use('/v1/ai', authenticateAnyToken, aiEvaluationRouter);
app.use('/v1/workflow', authenticateAnyToken, workflowAutomationRouter);
app.use('/v1/kyc', authenticateAnyToken, automatedKycRouter);
app.use('/v1/disbursement', authenticateAnyToken, automatedDisbursementRouter);
app.use('/v1/notifications', authenticateAnyToken, notificationsRouter);
// Payments: the router authenticates every route itself (API key / Firebase
// token) EXCEPT POST /v1/payments/webhook, which Razorpay calls and which is
// authenticated by HMAC signature. See routes/payments.ts.
app.use('/v1/payments', paymentsRouter);
// Parse: the LLM-backed PDF parser is gated behind auth + quota so an anonymous
// 10 MB upload can't drive unbounded third-party LLM spend. The public
// playground demo uses the client-side mock fallback, not this endpoint.
app.use('/v1/parse', authenticateAnyToken, enforceQuota, pdfParserRouter);
app.use('/v1/sales', authenticateAnyToken, salesRouter);
app.use('/v1/roi', authenticateAnyToken, roiRouter);
app.use('/v1/bureau', authenticateAnyToken, bureauRouter);
app.use('/v1/evaluation', authenticateAnyToken, evaluationRouter);
app.use('/v1/slack', authenticateAnyToken, slackAlertsRouter);
app.use('/v1/statement-analysis', authenticateAnyToken, statementAnalysisRouter);
app.use('/v1/prediction', authenticateAnyToken, predictionRouter);
app.use('/v1/enhanced-bureau', authenticateAnyToken, enhancedBureauRouter);
app.use('/v1/lender-matching', authenticateAnyToken, lenderMatchingRouter);

// ── Global Error Handler ───────────────────────────────────────────
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const requestId = (req as any).requestId;
  const method = req.method;
  const path = req.originalUrl;
  const status = (err as any).status || (err as any).statusCode || 500;

  console.error(`[ERROR] ${requestId} ${method} ${path} → ${status}:`, {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  if (res.headersSent) {
    return next(err);
  }

  if (err.message?.includes('CORS')) {
    return res.status(403).json({ error: 'Cross-origin request blocked' });
  }

  if (err.message?.includes('rate limit') || err.message?.includes('Too many')) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { requestId }),
  });
});

// ── Graceful Shutdown ────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 Arera AI API Gateway running on port ${PORT}`);

  setInterval(() => {
    processWebhookQueue().catch(err => console.error("Webhook processor error:", err));
  }, 30000);

  setInterval(() => {
    runDailyCollectionCheck().catch(err => console.error("Collection automation error:", err));
  }, 6 * 60 * 60 * 1000);

  const msUntil6AM = (() => {
    const now = new Date();
    const target = new Date(now);
    target.setHours(6, 0, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return target.getTime() - now.getTime();
  })();
  setTimeout(() => {
    runPortfolioClassification().catch(err => console.error("Portfolio classification error:", err));
    setInterval(() => {
      runPortfolioClassification().catch(err => console.error("Portfolio classification error:", err));
    }, 24 * 60 * 60 * 1000);
  }, msUntil6AM);

  setTimeout(() => {
    runDailyCollectionCheck().catch(err => console.error("Initial collection check error:", err));
    runPortfolioClassification().catch(err => console.error("Initial portfolio classification error:", err));
  }, 5000);
});

const shutdown = (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close((err) => {
    if (err) {
      console.error('Error closing HTTP server:', err);
      process.exit(1);
    }
    console.log('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
