// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDLzvA8n0LkM2VtPxbVAopOAR6FYbWZjI0',
  authDomain: 'no-boundaries-a5cc1.firebaseapp.com',
  projectId: 'no-boundaries-a5cc1',
  storageBucket: 'no-boundaries-a5cc1.appspot.com',
  messagingSenderId: '118904194415',
  appId: '1:118904194415:web:e8921778bdf7b9829d549a',
  measurementId: 'G-G6PZBEKFTQ'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export { analytics, db }
