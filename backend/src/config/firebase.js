import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
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
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: firebaseConfig.storageBucket
    });
    initialized = true;
    console.log('✅ Firebase Admin SDK initialized with service account');
  } catch (error) {
    console.error('❌ Failed to load service account:', error.message);
  }
}

if (!initialized) {
  // Initialize without credentials for development
  try {
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket
    });
    console.log('⚠️  Firebase Admin SDK initialized without credentials (development mode)');
  } catch (error) {
    console.warn('Firebase Admin SDK initialization warning:', error.message);
  }
}

// Export Firestore and Storage instances
export const db = admin.firestore();
export const storage = admin.storage();
export const auth = admin.auth();

export default admin;
