import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const isDev = import.meta.env.VITE_DEV === 'dev';

const firebaseConfig = {
  apiKey: isDev ? import.meta.env.VITE_FIREBASE_API_KEY : import.meta.env.VITE_FIREBASE_API_KEY_DEV,
  authDomain: isDev ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEV,
  projectId: isDev ? import.meta.env.VITE_FIREBASE_PROJECT_ID : import.meta.env.VITE_FIREBASE_PROJECT_ID_DEV,
  storageBucket: isDev ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET : import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_DEV,
  messagingSenderId: isDev ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID : import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEV,
  appId: isDev ? import.meta.env.VITE_FIREBASE_APP_ID : import.meta.env.VITE_FIREBASE_APP_ID_DEV,
}

if (isDev) console.log('[ FIREBASE ] : Running in development mode');


const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const googleProvider = new GoogleAuthProvider();

export { firebaseApp, auth, googleProvider }