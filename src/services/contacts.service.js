import { ref, update, equalTo, orderByChild, query, push, onValue, get } from 'firebase/database';
import { db } from '../config/firebase-config';

/**
 * Creates a new contact list.
 *
 * @param {string} title - The title of the contact list.
 * @param {string} user - The user creating the contact list.
 * @param {string} icon - The icon associated with the contact list.
 * @returns {Promise<void>} A promise that resolves when the contact list is created.
 */
export const createContactList = (title, user, icon) => {
  const owner = user.toLowerCase();
  push(ref(db, 'contactLists'), {
    title,
    owner,
    icon
  }).then((list) => {
    const listKey = list.key;
    const updates = {};
    updates[`users/${owner}/contactLists/${listKey}`] = true;
    updates[`contactLists/${listKey}/key/`] = listKey;
    return update(ref(db), updates);
  }).catch((error) => {
    console.error('Error creating list', error);
  });
};

/**
 * Deletes a contact list.
 *
 * @param {string} contactListId - The ID of the contact list to delete.
 * @param {string} user - The user deleting the contact list.
 * @returns {Promise<void>} A promise that resolves when the contact list is deleted.
 */
export const deleteContactList = (contactListId, user) => {
  const owner = user.toLowerCase();
  const updates = {};
  updates[`contactLists/${contactListId}`] = null;
  updates[`users/${owner}/contactLists/${contactListId}`] = null;

  return update(ref(db), updates);
};

/**
 * Updates the status of a contact in a contact list.
 *
 * @param {string} contactListKey - The key of the contact list.
 * @param {string} contactToUpdate - The contact to update.
 * @param {boolean} updateStatus - The new status of the contact.
 * @returns {Promise<void>} A promise that resolves when the contact status is updated.
 */
export const updateContactsInList =(contactListKey, contactToUpdate, updateStatus) => {
  const contact = contactToUpdate.toLowerCase();
  const updates = {};
  updates[`contactLists/${contactListKey}/contacts/${contact}`] = updateStatus;

  return update(ref(db), updates);
};


/**
 * Adds a contact to a user's contact list.
 *
 * @param {string} userName - The username of the user.
 * @param {string} contactName - The name of the contact to add.
 * @returns {Promise<void>} A promise that resolves when the contact is added.
 */
export const addContact = (userName, contactName) => {
  const updates = {};
  const user = userName.toLowerCase();
  const contact = contactName.toLowerCase();
  updates[`users/${user}/contacts/${contact}`] = true;

  return update(ref(db), updates);
};

/**
 * Removes a contact from a user's contact list.
 *
 * @param {string} userName - The username of the user.
 * @param {string} contactName - The name of the contact to remove.
 * @returns {Promise<void>} A promise that resolves when the contact is removed.
 */
export const removeContact = (userName, contactName) => {
  const updates = {};
  const user = userName.toLowerCase();
  const contact = contactName.toLowerCase();
  updates[`users/${user}/contacts/${contact}`] = null;

  return update(ref(db), updates);
};

/**
 * Listens for changes to the user's contact lists and calls the callback function.
 *
 * @param {string} user - The username of the user.
 * @param {function} callBack - The callback function to be called with the contact list data.
 * @returns {function} A function that can be used to stop listening to updates.
 */
export const contactListsListener = (user, callBack) => {
  const userName = user.toLowerCase();
  const queryRef = query(ref(db, 'contactLists'), orderByChild('owner'), equalTo(userName));

  return onValue(queryRef, (snapshot) => {
    const data = snapshot.val() ? Object.values(snapshot.val()) : [];
    callBack(data);
  });
};

/**
 * Retrieves the contact lists belonging to a user.
 *
 * @param {string} user - The username of the user.
 * @returns {Promise<DataSnapshot>} A promise that resolves with the contact lists data.
 */
export const getContactListsByUser = (user) => {
  const userName = user.toLowerCase();
  return get(query(ref(db, 'contactLists'), orderByChild('owner'), equalTo(userName)));
};
/**
 * Listens for changes to user status and calls the callback function.
 *
 * @param {function} callBack - The callback function to be called with the user status data.
 * @returns {function} A function that can be used to stop listening to updates.
 */
export const userStatusListener = (callBack) => {
  const queryRef = ref(db, 'userStatus');

  return onValue(queryRef, (snapshot) => {
    const data = snapshot.val() ? snapshot.val() : [];
    callBack(data);
  });
};
