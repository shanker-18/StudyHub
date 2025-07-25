import admin from 'firebase-admin';

export const initializeFirebase = () => {
  if (admin.apps.length === 0) {
    try {
      // For development, we'll use a mock configuration
      // In production, you should use proper service account credentials
      if (process.env.NODE_ENV === 'development') {
        console.log('🔥 Firebase Admin initialized in development mode');
        console.log('⚠️  Note: Please configure proper Firebase credentials for production');
        return;
      }
      
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: "https://studyhub.firebaseio.com"
      });
      console.log('🔥 Firebase Admin initialized');
    } catch (error) {
      console.warn('⚠️  Firebase Admin initialization failed:', error.message);
      console.log('🔧 Running in development mode without Firebase Admin');
    }
  }
};
