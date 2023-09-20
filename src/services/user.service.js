import { get, set, ref, query, equalTo, orderByChild, update, } from 'firebase/database';
import { db } from '../config/firebase-config';

/**
 * Get user data by their handle (username).
 *
 * @param {string} handle - The user's handle (username).
 * @returns {Promise<DataSnapshot>} A promise that resolves with the user's data snapshot.
 */
export const getUserByHandle = (handle) => {
  const userName = handle.toLowerCase();
  return get(ref(db, `users/${userName}`));
};

/**
 * Get data of all users.
 *
 * @returns {Promise<DataSnapshot>} A promise that resolves with a snapshot of all user data.
 */
export const getAllUsers = () => {
  return get(ref(db, 'users'));
};

/**
 * Get user data by their email address.
 *
 * @param {string} email - The user's email address.
 * @returns {Promise<DataSnapshot>} A promise that resolves with the user's data snapshot.
 */
export const getUserByEmail = (email) => {
  return get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));
};

/**
 * Get participants of an event with additional user details.
 *
 * @param {object} eventData - The event data.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of participants with user details.
 */
export const getParticipantsWithUserDetails = async (eventData) => {
  const participantsWithDetails = [];

  try {
    const usersSnapshot = await getAllUsers();
    if (usersSnapshot.exists()) {
      const usersData = usersSnapshot.val();
      for (const participantName of Object.keys(eventData.participants)) {
        const userHandleLowerCase = participantName.toLowerCase();
        const userData = usersData[userHandleLowerCase];
        if (userData) {
          const participantWithUserData = {
            name: participantName,
            userName: userData.userName || '',
            photoUrl: userData.photoUrl || '',
          };

          participantsWithDetails.push(participantWithUserData);
        }
      }


      return participantsWithDetails;
    } else {
      return participantsWithDetails;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return participantsWithDetails;
  }
};

/**
 * Get user data by their unique ID (UID).
 *
 * @param {string} uid - The user's unique ID (UID).
 * @returns {Promise<DataSnapshot>} A promise that resolves with the user's data snapshot.
 */
export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

/**
 * Create a new user handle (username) and associated user data.
 *
 * @param {string} handle - The user's handle (username).
 * @param {string} uid - The user's unique ID (UID).
 * @param {string} email - The user's email address.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} phoneNumber - The user's phone number.
 * @param {string} userName - The user's username.
 * @returns {Promise<void>} A promise that resolves when the user handle and data are successfully created.
 */
export const createUserHandle = (handle, uid, email, firstName, lastName, phoneNumber, userName) => {
  return set(ref(db, `users/${handle}`), {
    uid,
    email,
    firstName,
    lastName,
    phoneNumber,
    userName,
    role: 'User',
    isBlocked: false,
    createdOn: Date.now()
  });
};

/**
 * Update user data.
 *
 * @param {string} userName - The user's username.
 * @param {string} data - The data field to update.
 * @param {any} value - The new value to set for the data field.
 * @returns {Promise<void>} A promise that resolves when the user data is successfully updated.
 */
export const updateUserData = (userName, data, value) => {
  return update(ref(db), {
    [`users/${userName}/${data}`]: value,
  });
};

/**
 * Update user's photo URL.
 *
 * @param {string} handle - The user's handle (username).
 * @param {string} newPhoto - The new photo URL.
 * @returns {Promise<void>} A promise that resolves when the user's photo URL is successfully updated.
 */
export const updatePhotoUrl = (handle, newPhoto) => {
  return update(ref(db, `users/${handle}`), {
    photoUrl: newPhoto,
  });
};

/**
 * Mark a notification as read and remove it from the user's notifications list.
 *
 * @param {string} userName - The user's username.
 * @param {string} type - The type of notification (e.g., 'notifications').
 * @param {string} data - The ID of the notification to mark as read and remove.
 * @returns {Promise<void>} A promise that resolves when the notification is successfully marked as read and removed.
 */
export const markNotificationRead = (userName, type, data) => {
  const user = userName.toLowerCase();
  const updates = {};
  updates[`users/${user}/${type}/${data}`] = null;
  if(type === 'notifications') {
    updates[`${type}/${data}`] = null;
  }
  return update(ref(db), updates);
};
