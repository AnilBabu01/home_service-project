import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAu6ESeXPKxgjh7MjgYlXE-b-ZJIaY9Z2E",
    authDomain: "andamanhum.firebaseapp.com",
    projectId: "andamanhum",
    storageBucket: "andamanhum.firebasestorage.app",
    messagingSenderId: "608897477479",
    appId: "1:608897477479:web:657919cc56d814d9261dc2",
    measurementId: "G-4DJKGSWLZ6",
}

// Initialize Firebase only once
let app
if (!getApps().length) {
    app = initializeApp(firebaseConfig)
} else {
    app = getApp()
}

const auth = getAuth(app)

export { auth }
