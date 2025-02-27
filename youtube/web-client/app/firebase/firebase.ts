// import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User
} from "firebase/auth"

// your web app's firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4G5MTebWjtKtolEMPArccsPAjI-0mRe8",
  authDomain: "neetcoding-fc349.firebaseapp.com",
  projectId: "neetcoding-fc349",
  appId: "1:116467807401:web:c8f97efce357ea4ad3a5b8"
}

// initialize firebase
const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

export function signinWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider())
}

export function signOut() {
  return auth.signOut()
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
