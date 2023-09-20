import { get, push, ref as dbRef, update, remove, query, orderByChild, equalTo, } from '@firebase/database';
import { db } from '../config/firebase-config';
import { ref as storageRef, uploadBytes, getDownloadURL, } from 'firebase/storage';
import { storage } from '../config/firebase-config';
import { createReminder } from './reminder.service';
import { markNotificationRead } from './user.service';

/**
 * Creates a new event and performs various associated actions.
 *
 * @param {string} title - The title of the event.
 * @param {string} description - The description of the event.
 * @param {string} startDate - The start date and time of the event.
 * @param {string} endDate - The end date and time of the event.
 * @param {string} address - The address of the event.
 * @param {boolean} isPublic - Whether the event is public or not.
 * @param {boolean} isOnline - Whether the event is online or not.
 * @param {string} authorId - The ID of the event author.
 * @param {string} owner - The owner of the event.
 * @param {string} categoryId - The category ID of the event.
 * @param {boolean} reoccurring - Whether the event is recurring or not (default is false).
 * @param {File} selectedImage - The selected image for the event (optional).
 * @param {number} latitude - The latitude coordinate of the event location.
 * @param {number} longitude - The longitude coordinate of the event location.
 * @param {Object} participants - Object containing participants' information.
 * @param {string} ownerAvatar - The owner's avatar (default is an empty string).
 * @param {string} reminderDate - The reminder date and time for the event (optional).
 * @param {Object} editors - Object containing editors' information.
 * @param {boolean} isAllDay - Whether the event is an all-day event.
 * @returns {Promise<void>} A promise that resolves when the event is created and associated actions are completed.
 */
export const createEvent = (
  title,
  description,
  startDate,
  endDate,
  address,
  isPublic,
  isOnline,
  authorId,
  owner,
  categoryId,
  reoccurring = false,
  selectedImage,
  latitude,
  longitude,
  participants,
  ownerAvatar = '',
  reminderDate,
  editors,
  isAllDay
) => {
  const isoStartDate = startDate.toISOString();
  const isoEndDate = endDate.toISOString();
  const isoReminderDate = reminderDate ? reminderDate.toISOString() : null;
  const userName = owner.toLowerCase();

  return push(dbRef(db, 'events'), {
    title,
    description,
    startDate: isoStartDate,
    endDate: isoEndDate,
    address,
    isPublic,
    isOnline,
    authorId,
    userName,
    categoryId,
    reoccurring,
    photoUrl:
      'https://firebasestorage.googleapis.com/v0/b/event-eaze.appspot.com/o/eventsImages%2F14-min.png?alt=media&token=eef81b45-4adc-48bc-b393-dd7a16af3f6c',
    latitude,
    longitude,
    participants,
    editors,
    isAllDay
  })
    .then((event) => {
      Object.keys(participants).forEach((participant) =>
        createNotification(
          event.key,
          owner,
          participant,
          ownerAvatar,
          title,
          isoStartDate
        )
      );

      if (isoReminderDate) {
        createReminder(
          event.key,
          reoccurring,
          isoReminderDate,
          userName,
          description,
          title
        );
      }

      return event;
    }).then(async (event) => {
      if (selectedImage) {
        try {
          const imageRef = storageRef(storage, `eventsImages/${selectedImage.name}`);
          await uploadBytes(imageRef, selectedImage);
          const url = await getDownloadURL(imageRef);
          await update(dbRef(db), {
            [`events/${event.key}/photoUrl`]: url,
          });
          return event;
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      } else {
        return event;
      }
    })
    .then((event) => {
      const updates = {};
      updates[`users/${userName}/events/${event.key}`] = true;
      updates[`events/${event.key}/id`] = event.key;
      update(dbRef(db), updates);
    });
};

/**
 * Get an event by its unique identifier (ID).
 *
 * @param {string} eventId - The unique ID of the event to retrieve.
 * @returns {Promise<Object>} A promise that resolves with the event data.
 * @throws {Error} Throws an error if the event with the specified ID does not exist.
 */
export const getEventById = (eventId) => {
  return get(dbRef(db, `events/${eventId}`)).then((snapshot) => {
    if (!snapshot.exists()) {
      throw new Error(`Event with id ${eventId} does not exist!`);
    }
    const event = snapshot.val();
    event.id = eventId;

    event.startDate = new Date(event.startDate);
    event.endDate = new Date(event.endDate);
    if (!event.participants || typeof event.participants !== 'object') {
      event.participants = {};
    }
    return event;
  });
};

/**
 * Get all events associated with a specific user by their username.
 *
 * @param {string} userName - The username of the user to retrieve events for.
 * @returns {Promise<Object[]>} A promise that resolves with an array of events associated with the user.
 */
export const getEventsByUserName = async (userName) => {
  const eventsRef = dbRef(db, 'events');
  const eventsSnapshot = await get(eventsRef);
  const events = [];
  const owner = userName.toLowerCase();
  eventsSnapshot.forEach((eventSnapshot) => {
    const event = eventSnapshot.val();
    if (event.userName === owner || (event.participants && event.participants[owner] === true)) {
      event.id = eventSnapshot.key;
      event.startDate = new Date(event.startDate);
      event.endDate = new Date(event.endDate);
      events.push(event);
    }
  });

  return events;
};

/**
 * Get all events from the database.
 *
 * @returns {Promise<Object[]>} A promise that resolves with an array of all events.
 */
export const getAllEvents = () => {
  return get(dbRef(db, 'events')).then((snapshot) => {
    const events = [];
    snapshot.forEach((childSnapshot) => {
      const event = childSnapshot.val();
      event.id = childSnapshot.key;
      event.startDate = new Date(event.startDate);
      event.endDate = new Date(event.endDate);
      if (!event.participants) {
        event.participants = [];
      }
      events.push(event);
    });
    return events;
  });
};

/**
 * Get an event by its unique identifier (ID).
 *
 * @param {string} eventId - The unique ID of the event to retrieve.
 * @returns {Promise<Object>} A promise that resolves with the event data.
 */
export const getEvent = (eventId) => {
  return get(dbRef(db, `events/${eventId}`));
};

/**
 * Get a notification by its unique identifier (ID).
 *
 * @param {string} notificationId - The unique ID of the notification to retrieve.
 * @returns {Promise<Object>} A promise that resolves with the notification data.
 */
export const getNotification = (notificationId) => {
  return get(dbRef(db, `notifications/${notificationId}`));
};

/**
 * Get all public events from the database.
 *
 * @returns {Promise<Object[]>} A promise that resolves with an array of all public events.
 */
export const getAllPublicEvents = () => {
  const eventsRef = dbRef(db, 'events');
  return get(eventsRef).then((snapshot) => {
    const publicEvents = [];
    snapshot.forEach((childSnapshot) => {
      const event = childSnapshot.val();
      if (event.isPublic === true) {
        event.id = childSnapshot.key;
        event.startDate = new Date(event.startDate);
        event.endDate = new Date(event.endDate);
        if (!event.participants) {
          event.participants = [];
        }
        publicEvents.push(event);
      }
    });
    return publicEvents;
  });
};

/**
 * Get event categories from the database.
 *
 * @returns {Promise<Object>} A promise that resolves with event categories data.
 */
export const getEventCategories = () => {
  return get(dbRef(db, 'eventCategories'));
};

/**
 * Create a notification for an event and participant.
 *
 * @param {string} eventId - The ID of the associated event.
 * @param {string} userName - The username of the event owner.
 * @param {string} participant - The participant's username.
 * @param {string} ownerAvatar - The owner's avatar.
 * @param {string} title - The event title.
 * @param {string} startDate - The event start date.
 */
export const createNotification = (
  eventId,
  userName,
  participant,
  ownerAvatar,
  title,
  startDate
) => {
  push(dbRef(db, 'notifications'), {
    eventId,
    userName,
    ownerAvatar,
    title,
    startDate,
    participant
  }).then((notification) => {
    const notificationKey = notification.key;
    const updates = {};
    updates[`users/${participant}/notifications/${notificationKey}`] = true;
    updates[`users/${participant}/events/${eventId}`] = true;
    updates[`notifications/${notificationKey}/notificationId`] =
      notificationKey;
    return update(dbRef(db), updates);
  });
};

/**
 * Delete an event and associated data from the database.
 *
 * @param {string} eventId - The ID of the event to delete.
 * @returns {Promise<Object>} A promise that resolves with the deleted event data.
 */
export const deleteEvent = (eventId) => {
  const eventRef = dbRef(db, `events/${eventId}`);

  return get(eventRef)
    .then((eventSnapshot) => {
      if (eventSnapshot.exists()) {
        const event = eventSnapshot.val();

        remove(eventRef);

        return event;
      }
    })
    .then((event) => {
      deleteParticipantEvent(event.userName, event.id);

      if (event.participants) {
        const participantDeletions = Object.keys(event.participants).map(
          (participant) => deleteParticipantEvent(participant, eventId)
        );

        Promise.all(participantDeletions);
      }

      return event;
    })
    .then((event) => {
      deleteEventNotifications(event);
      return event;
    })
    .then((event) => deleteEventReminder(event))
    .catch((error) => {
      console.log('Error deleting event', error);
    });
};

/**
 * Delete an event from a participant's list of events.
 *
 * @param {string} participant - The username of the participant.
 * @param {string} eventId - The ID of the event to delete from the participant's list.
 * @returns {Promise<void>} A promise that resolves when the event is deleted from the participant's list.
 */
export const deleteParticipantEvent = (participant, eventId) => {
  const user = participant.toLowerCase();

  return update(dbRef(db), {
    [`users/${user}/events/${eventId}`]: null,
  });
};

/**
 * Delete notifications associated with an event.
 *
 * @param {Object} event - The event for which notifications should be deleted.
 */
export const deleteEventNotifications = (event) => {
  get(query(dbRef(db, 'notifications'), orderByChild('eventId'), equalTo(event.id)))
    .then((snapshot) => {
      if (snapshot.exists()) {
        Object.values(snapshot.val()).forEach((notification) => {
          const updates = {};
          updates[`notifications/${notification.notificationId}`] = null;
          updates[`users/${notification.participant}/notifications/${notification.notificationId}`] = null;

          update(dbRef(db),updates);
        });
      }
    });
};

/**
 * Delete reminders associated with an event.
 *
 * @param {Object} event - The event for which reminders should be deleted.
 */
export const deleteEventReminder = (event) => {
  get(query(dbRef(db, 'reminders'), orderByChild('eventId'), equalTo(event.id)))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const reminders = Object.values(snapshot.val());

        reminders.forEach(reminder => {
          const updates = {};
          updates[`reminders/${reminder.reminderId}`] = null;
          updates[`users/${reminder.userName}/reminders/${reminder.reminderId}`]= null;

          update(dbRef(db), updates);
        });
      }
    });
};

/**
 * Update an event with new information.
 *
 * @param {string} eventId - The ID of the event to update.
 * @param {string} newTitle - The new title for the event.
 * @param {string} newDescription - The new description for the event.
 * @param {string} newStartDate - The new start date and time for the event.
 * @param {string} newEndDate - The new end date and time for the event.
 * @param {string} newAddress - The new address for the event.
 * @param {boolean} newIsPublic - Whether the event is now public or not.
 * @param {boolean} newIsOnline - Whether the event is now online or not.
 * @param {string} newCategoryId - The new category ID for the event.
 * @param {boolean} newReoccurring - Whether the event is now recurring or not.
 * @param {number} newLatitude - The new latitude coordinate of the event location.
 * @param {number} newLongitude - The new longitude coordinate of the event location.
 * @param {File|null} newSelectedImage - The new selected image for the event (or null if unchanged).
 * @param {string} newPhotoUrl - The new photo URL for the event.
 * @param {Object} newParticipants - The updated participants for the event.
 * @param {Object} newEditors - The updated editors for the event.
 * @param {boolean} newIsAllDay - Whether the event is now an all-day event.
 * @param {Object} newlyAddedParticipants - Participants added to the event.
 * @param {string} userName - The username of the user making the update.
 * @param {string} userAvatar - The avatar of the user making the update.
 * @param {string|null} reminderDate - The new reminder date and time for the event (or null if no reminder).
 * @param {string|null} reminderId - The ID of the event's reminder (or null if no reminder).
 * @param {Object} removedParticipants - Participants removed from the event.
 * @returns {Promise<void>} A promise that resolves when the event is updated.
 */
export const updateEvent = (
  eventId,
  newTitle,
  newDescription,
  newStartDate,
  newEndDate,
  newAddress,
  newIsPublic,
  newIsOnline,
  newCategoryId,
  newReoccurring,
  newLatitude,
  newLongitude,
  newSelectedImage,
  newPhotoUrl,
  newParticipants,
  newEditors,
  newIsAllDay,
  newlyAddedParticipants,
  userName,
  userAvatar,
  reminderDate,
  reminderId,
  removedParticipants
) => {
  const imageUrl = newSelectedImage || newPhotoUrl;
  const user = userName.toLowerCase();
  const isoStartDate = newStartDate.toISOString();
  const isoReminderDate = reminderDate ? reminderDate.toISOString() : null;

  const updates = {
    title: newTitle,
    description: newDescription,
    startDate: newStartDate,
    endDate: newEndDate,
    address: newAddress,
    isPublic: newIsPublic,
    isOnline: newIsOnline,
    categoryId: newCategoryId,
    reoccurring: newReoccurring,
    latitude: newLatitude,
    longitude: newLongitude,
    photoUrl: imageUrl,
    participants: newParticipants,
    editors: newEditors,
    isAllDay: newIsAllDay
  };

  Object.keys(newlyAddedParticipants).forEach(participant =>
    createNotification(
      eventId,
      user,
      participant,
      userAvatar,
      newTitle,
      isoStartDate
    )
  );

  Object.keys(removedParticipants).forEach(participant =>
    deleteParticipantEvent(participant, eventId));

  get(query(dbRef(db, 'notifications'), orderByChild('eventId'), equalTo(eventId))
  ).then((snapshot) => {
    if (snapshot.exists()) {
      return Object.values(snapshot.val())
        .filter(notification => removedParticipants[notification.participant]);
    }
  }).then(notificationsToRemove => {
    if(notificationsToRemove) {
      notificationsToRemove.forEach(notification => {
        markNotificationRead(notification.participant, 'notifications', notification.notificationId);
      });
    }
  });

  if (isoReminderDate && reminderId === null) {
    createReminder(
      eventId,
      newReoccurring,
      isoReminderDate,
      user,
      newDescription,
      newTitle
    );
  } else if (reminderId && isoReminderDate) {
    const updates = {};
    updates[`reminders/${reminderId}/recurring`] = newReoccurring;
    updates[`reminders/${reminderId}/reminderOn`] = isoReminderDate;
    updates[`users/${user}/reminders/${reminderId}`] = isoReminderDate;
    updates[`reminders/${reminderId}/description`] = newDescription;
    updates[`reminders/${reminderId}/title`] = newTitle;

    update(dbRef(db), updates);
  } else if (!isoReminderDate) {
    const updates = {};
    updates[`reminders/${reminderId}`] = null;
    updates[`users/${user}/reminders/${reminderId}`] = null;

    update(dbRef(db), updates);
  }

  return update(dbRef(db, `events/${eventId}`), updates);
};
