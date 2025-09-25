import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, GoogleAuthProvider, indexedDBLocalPersistence, setPersistence } from 'firebase/auth'

const isDev = import.meta.env.VITE_NODE_ENV === 'dev';

const firebaseConfig = {
  apiKey: isDev ? import.meta.env.VITE_FIREBASE_API_KEY_DEV : import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: isDev ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEV : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: isDev ? import.meta.env.VITE_FIREBASE_PROJECT_ID_DEV : import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: isDev ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_DEV : import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: isDev ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_DEV : import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: isDev ? import.meta.env.VITE_FIREBASE_APP_ID_DEV : import.meta.env.VITE_FIREBASE_APP_ID,
}

if (isDev) console.log('[ FIREBASE ] : Running in development mode');


const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const googleProvider = new GoogleAuthProvider();

(async () => {
  try {
    await setPersistence(auth, indexedDBLocalPersistence)
  } catch {
    await setPersistence(auth, browserLocalPersistence)
  }
})()

export { firebaseApp, auth, googleProvider }