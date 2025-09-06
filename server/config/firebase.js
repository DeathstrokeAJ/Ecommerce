import admin from 'firebase-admin';
import serviceAccount from './astha-travels-firebase-adminsdk-fbsvc-98ce76e84a.json' assert { type: 'json' };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const db = admin.firestore();
