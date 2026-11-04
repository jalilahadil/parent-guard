/**
 * Firebase web config for parentguard-e2815.
 * Keep google-services.json aligned with package com.parentguard.app.
 */
export const firebaseConfig = {
  apiKey: 'AIzaSyAUxKTH_ybXrVV13ZYZSnyL6h9jQpRaLxU',
  authDomain: 'parentguard-e2815.firebaseapp.com',
  projectId: 'parentguard-e2815',
  storageBucket: 'parentguard-e2815.firebasestorage.app',
  messagingSenderId: '1025073492457',
  appId: '1:1025073492457:web:b77fc1381370d147bf9b78',
};

export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) &&
  firebaseConfig.apiKey !== 'REPLACE_ME' &&
  firebaseConfig.projectId !== 'REPLACE_ME';
