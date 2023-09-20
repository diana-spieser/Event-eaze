
import { get, ref as dbRef, update } from '@firebase/database';
import { db } from '../config/firebase-config';

/**
 * Subscribe a user to an event by adding them to the event's participants.
 *
 * @param {string} eventId - The ID of the event to subscribe to.
 * @param {string} userName - The username of the user subscribing to the event.
 * @returns {Promise<string>} A promise that resolves with a success message if the subscription is successful.
 * @throws {string} Throws an error message if the event does not exist or the user is already subscribed.
 */
export const subscribeToEvent = (eventId, userName) => {
  const eventRef = dbRef(db, `events/${eventId}`);
  // eslint-disable-next-line no-unused-vars
  const userEventRef = dbRef(db, `users/${userName}/events/${eventId}`);
  const lowercasedUserName = userName.toLowerCase();

  return get(eventRef)
    .then((eventSnapshot) => {
      if (!eventSnapshot.exists()) {
        return Promise.reject(`Event with ID ${eventId} does not exist.`);
      }

      const participants = eventSnapshot.val().participants || {};

      if (participants[lowercasedUserName]) {
        return Promise.reject(
          `User ${userName} is already subscribed to this event.`
        );
      }

      participants[lowercasedUserName] = true;

      return update(eventRef, { participants })
        .then(() => {
          const updates = {};
          updates[`users/${lowercasedUserName}/events/${eventId}`] = true;
          return update(dbRef(db), updates);
        })
        .then(() => {
          return `User ${userName} subscribed to event ${eventId} successfully.`;
        });
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(error);
    });
};

/**
 * Unsubscribe a user from an event by removing them from the event's participants.
 *
 * @param {string} eventId - The ID of the event to unsubscribe from.
 * @param {string} userName - The username of the user unsubscribing from the event.
 * @returns {Promise<string>} A promise that resolves with a success message if the unsubscription is successful.
 * @throws {string} Throws an error message if the event does not exist or the user is not subscribed.
 */
export const unsubscribeFromEvent = (eventId, userName) => {
  const eventRef = dbRef(db, `events/${eventId}`);
  const lowercasedUserName = userName.toLowerCase();

  return get(eventRef)
    .then((eventSnapshot) => {
      if (!eventSnapshot.exists()) {
        return Promise.reject(`Event with ID ${eventId} does not exist.`);
      }

      const participants = eventSnapshot.val().participants || {};

      if (!participants[lowercasedUserName]) {
        return Promise.reject(
          `User ${userName} is not subscribed to this event.`
        );
      }

      delete participants[lowercasedUserName];
      return update(eventRef, { participants })
        .then(() => {
          const updates = {};
          updates[`users/${lowercasedUserName}/events/${eventId}`] = null;
          return update(dbRef(db), updates);
        })
        .then(
          () =>
            `User ${userName} unsubscribed from event ${eventId} successfully.`
        );
    })
    .catch((error) => {
      console.error(error);
      return Promise.reject(error);
    });
};

/**
 * Check if a user is subscribed to an event.
 *
 * @param {string} eventId - The ID of the event to check for subscription.
 * @param {string} username - The username of the user to check for subscription.
 * @returns {Promise<boolean>} A promise that resolves with `true` if the user is subscribed, `false` otherwise.
 */
export const checkIfUserIsSubscribed = (eventId, username) => {
  if (!username) {
    return Promise.resolve(false);
  }

  const lowercasedUsername = username.toLowerCase();

  return new Promise((resolve, reject) => {
    const eventRef = dbRef(db, `events/${eventId}`);
    get(eventRef)
      .then((eventSnapshot) => {
        if (eventSnapshot.exists()) {
          const participants = eventSnapshot.val().participants || {};
          const isSubscribed = participants[lowercasedUsername] === true;
          resolve(isSubscribed);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
