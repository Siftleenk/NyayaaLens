import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⚠️  NOTE: Your appId appears truncated ("1:5996402176:web").
//    A full appId looks like "1:5996402176:web:abc123def456".
//    If you get a Firebase initialization error, go to:
//    Firebase Console → Project Settings → Your Apps → copy the full appId.

const firebaseConfig = {
  apiKey: 'AIzaSyDu9e4r2H5Cpbjz8kdERAG70wWwr9W7m0o',
  authDomain: 'nyaya-lens.firebaseapp.com',
  projectId: 'nyaya-lens',
  storageBucket: 'nyaya-lens.firebasestorage.app',
  messagingSenderId: '5996402176',
  appId: '1:5996402176:web',
  measurementId: 'G-V5QBYCTMCE',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
