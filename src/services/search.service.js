import { get, ref } from 'firebase/database';
import { db } from '../config/firebase-config';

/**
 * Search for users in the database based on a search query.
 *
 * @param {string} searchQuery - The search query to filter users.
 * @returns {Promise<Object[]>} A promise that resolves with an array of users matching the search criteria.
 */
export const searchUsers = (searchQuery) => {
  return get(ref(db, 'users')).then((snapshot) => {
    const users = [];
    const query = searchQuery.toLowerCase();
    snapshot.forEach((childSnapshot) => {
      const user = childSnapshot.val();
      if (
        user.userName &&
        (user.userName.toLowerCase().includes(query)
        || user.email.toLowerCase().includes(query)
        || user.firstName.toLowerCase().includes(query)
        || user.lastName.toLowerCase().includes(query))
        || user.phoneNumber.includes(query)
      ) {
        users.push(user);
      }
    });
    return users;
  });
};


/**
 * Search for events in the database based on a search query, user's admin status, and author's username.
 *
 * @param {string} searchQuery - The search query to filter events.
 * @param {boolean} isAdmin - Whether the user is an admin.
 * @param {string} authorUserName - The username of the event's author.
 * @returns {Promise<Object[]>} A promise that resolves with an array of events matching the search criteria.
 */
export const searchEvents = (searchQuery, isAdmin, authorUserName) => {
  const eventsRef = ref(db, 'events');

  return new Promise((resolve, reject) => {
    get(eventsRef)
      .then((eventsSnapshot) => {
        const events = [];
        const query = searchQuery.toLowerCase();

        eventsSnapshot.forEach((eventSnapshot) => {
          const event = eventSnapshot.val();
          event.id = eventSnapshot.key;
          event.startDate = new Date(event.startDate);
          event.endDate = new Date(event.endDate);

          if (
            (isAdmin || event.isPublic || event.userName === authorUserName) &&
            (event.title.toLowerCase().includes(query) ||
              event.description.toLowerCase().includes(query) ||
              event.categoryId.toLowerCase().includes(query))
          ) {
            events.push(event);
          }
        });

        resolve(events);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
