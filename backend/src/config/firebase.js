require('dotenv').config();
const admin = require('firebase-admin');
const { getApps, initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

/**
 * Initializes Firebase Admin SDK using environment variables securely loaded via dotenv.
 * Prevents hardcoding sensitive Service Account Keys in the source repository.
 */
let db = null;
let auth = null;

try {
  const apps = getApps();
  if (apps.length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    // Check if real credentials are provided (and not template placeholders)
    const hasValidKey = privateKey && !privateKey.includes('...');

    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && hasValidKey) {
      const app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('✅ [Firebase Admin] Successfully initialized via Service Account credentials.');
      db = getFirestore(app);
      auth = getAuth(app);
    } else {
      console.log('ℹ️ [Firebase Admin] Running in standalone/mock mode (Template or missing credentials detected).');
    }
  } else {
    const app = apps[0];
    db = getFirestore(app);
    auth = getAuth(app);
  }
} catch (error) {
  console.warn('⚠️ [Firebase Admin] Notice:', error.message);
}

module.exports = { admin, db, auth };

