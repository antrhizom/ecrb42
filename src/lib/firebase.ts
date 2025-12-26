import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD9UWXhEp_RxFEDEzu_ziC42e9EfAcWldk",
  authDomain: "ecrb42-327b8.firebaseapp.com",
  projectId: "ecrb42-327b8",
  storageBucket: "ecrb42-327b8.firebasestorage.app",
  messagingSenderId: "768507576626",
  appId: "1:768507576626:web:a22783e2d63f33caa8172b"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
