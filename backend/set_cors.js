require('dotenv').config();
const { Storage } = require('@google-cloud/storage');

async function setCors() {
  try {
    const privateKeyString = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    const storage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID,
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: privateKeyString
      }
    });

    // The default Firebase storage bucket name:
    const bucketName = 'ogagency-5cc6a.appspot.com';
    const bucket = storage.bucket(bucketName);

    await bucket.setCorsConfiguration([
      {
        origin: ['*'], // Allow all origins for dev/prod flexibility (or restrict to frontend URLs)
        method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        responseHeader: ['Content-Type', 'Authorization', 'X-Firebase-Storage-Version', 'x-goog-resumable'],
        maxAgeSeconds: 3600,
      },
    ]);
    
    console.log(`Successfully updated CORS for bucket: ${bucketName}`);
  } catch (error) {
    console.error('Failed to set CORS:', error);
  }
}

setCors();
