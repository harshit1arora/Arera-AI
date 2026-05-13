import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import crypto from 'crypto';
import { db } from '../config/firebase';

export interface AuthenticatedRequest extends Request {
  orgId?: string;
  apiKeyId?: string;
  uid?: string;
}

/**
 * Hash an API key using SHA-256 for secure comparison.
 * We NEVER store plaintext keys — only their hashes.
 */
export const hashApiKey = (key: string): string => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

/**
 * Middleware: Authenticate via API Key (for programmatic/SDK access).
 * Keys are stored as SHA-256 hashes in Firestore.
 * Includes rate limiting awareness via usage logging.
 */
export const authenticateApiToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Hash the incoming key and compare against stored hashes
    const hashedToken = hashApiKey(token);

    const keysSnapshot = await db.collection('api_keys')
      .where('keyHash', '==', hashedToken)
      .where('isActive', '==', true)
      .limit(1)
      .get();

    if (keysSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid or revoked API key' });
    }

    const keyDoc = keysSnapshot.docs[0];
    const keyData = keyDoc.data();

    // Attach verified identity to request
    req.orgId = keyData.orgId;
    req.apiKeyId = keyDoc.id;

    // Update last used timestamp (fire-and-forget)
    keyDoc.ref.update({ lastUsedAt: new Date() }).catch(() => {});

    // Log usage asynchronously
    db.collection('usage_logs').add({
      orgId: keyData.orgId,
      path: req.originalUrl,
      method: req.method,
      status: 200,
      durationMs: 0,
      timestamp: new Date()
    }).catch(console.error);

    next();
  } catch (err) {
    console.error('Auth verification error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

/**
 * Middleware: Authenticate via Firebase ID Token (for dashboard/console access).
 * Used for admin operations like key generation, webhook config, etc.
 * This verifies the user's identity through Firebase Auth — no bypasses.
 */
export const authenticateFirebaseToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    req.orgId = decodedToken.uid; // In Arera, orgId === user's Firebase UID
    next();
  } catch (err) {
    console.error('Firebase token verification failed:', err);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};

/**
 * Middleware: Authenticate via API Key or Firebase ID Token.
 * Allows dual access for both internal dashboard and external API clients.
 */
export const authenticateAnyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  // Firebase ID tokens are very long JWTs (typically > 500 chars), API keys are shorter
  if (token.length > 200) {
    return authenticateFirebaseToken(req, res, next);
  } else {
    return authenticateApiToken(req, res, next);
  }
};
