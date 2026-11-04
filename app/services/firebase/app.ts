import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from '../../../firebase/config';

let app: FirebaseApp | null = null;

export function assertFirebaseConfigured(): void {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Provide credentials in firebase/config.ts and firebase/google-services.json.',
    );
  }
}

export function getFirebaseApp(): FirebaseApp {
  assertFirebaseConfigured();
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getFirestoreDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export { isFirebaseConfigured };
