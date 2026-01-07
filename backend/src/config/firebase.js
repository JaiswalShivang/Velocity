import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
};

let initialized = false;

// Check if we have a service account file
if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    // Resolve path relative to backend folder
    const serviceAccountPath = join(__dirname, '../../', process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    
    // Check if file exists before trying to read it
    if (existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: firebaseConfig.storageBucket
      });
      initialized = true;
      console.log('✅ Firebase Admin SDK initialized with service account');
    } else {
      console.log("Error")
    }
  } catch (error) {
    console.error('❌ Failed to load service account:', error.message);
  }
}

if (!initialized) {
  // Check for GOOGLE_APPLICATION_CREDENTIALS environment variable
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: firebaseConfig.storageBucket
      });
      initialized = true;
      console.log('✅ Firebase Admin SDK initialized with application default credentials');
    } catch (error) {
      console.warn('Failed to use application default credentials:', error.message);
    }
  }
}

if (!initialized) {
  console.error('');
  try {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket
    });
  } catch (error) {
    console.log(error);
  }
}

// Export Firestore and Storage instances
export const db = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();

export default admin;
