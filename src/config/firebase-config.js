import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBhOc2KoHRtu9SXPZ_2IClxdQkfE22WbGM',  
  authDomain: 'event-eaze.firebaseapp.com',  
  databaseURL: 'https://event-eaze-default-rtdb.europe-west1.firebasedatabase.app',  
  projectId: 'event-eaze',  
  storageBucket: 'event-eaze.appspot.com',  
  messagingSenderId: '699564981900',  
  appId: '1:699564981900:web:d65ad483f5c37f603405a9'  
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
