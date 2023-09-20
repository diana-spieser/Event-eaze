import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebase-config';

/**
 * Registers a new user with the provided email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @returns {Promise<import('firebase/auth').UserCredential>} A promise that resolves with user credentials on success.
 */
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs in an existing user with the provided email and password.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<import('firebase/auth').UserCredential>} A promise that resolves with user credentials on success.
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently logged-in user.
 *
 * @returns {Promise<void>} A promise that resolves on successful logout.
 */
export const logoutUser = () => {
  return signOut(auth);
};
