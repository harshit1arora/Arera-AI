import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Attempt to initialize using default credentials, or fallback for local dev
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } catch (err) {
    console.warn('Firebase Admin default initialization failed. Falling back to stub mode if credentials missing.');
    // In production/Render, set GOOGLE_APPLICATION_CREDENTIALS
    admin.initializeApp();
  }
}

export const db = admin.firestore();
