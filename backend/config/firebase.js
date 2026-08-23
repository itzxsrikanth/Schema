let isFirebaseInitialized = false;

const initializeFirebase = () => {
  try {
    if (process.env.FIREBASE_PROJECT_ID) {
      console.log('⚡ Firebase Config detected for project:', process.env.FIREBASE_PROJECT_ID);
      isFirebaseInitialized = true;
    } else {
      console.log('ℹ️ Firebase environment variables not fully set. Using resilient local memory store for demo & testing.');
    }
  } catch (error) {
    console.warn('⚠️ Firebase init warning:', error.message);
  }
};

const getIsFirebaseInitialized = () => isFirebaseInitialized;

module.exports = {
  initializeFirebase,
  getIsFirebaseInitialized
};
