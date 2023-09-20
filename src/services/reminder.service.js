import { get, push, ref, update, query, orderByChild, equalTo } from '@firebase/database';
import { db } from '../config/firebase-config';
import { addWeeks, addMonths, addYears, parseISO, addDays } from 'date-fns';

/**
 * Get a reminder by its unique identifier (ID).
 *
 * @param {string} reminderId - The unique ID of the reminder to retrieve.
 * @returns {Promise<Object>} A promise that resolves with the reminder data.
 */
export const getReminderById = (reminderId) => {
  return get(ref(db, `reminders/${reminderId}`));
};

/**
 * Get reminders associated with a specific event by event ID.
 *
 * @param {string} eventId - The ID of the event to retrieve reminders for.
 * @returns {Promise<Object[]>} A promise that resolves with an array of reminders for the specified event.
 */
export const getReminderByEventId = (eventId) => {
  return get(query(ref(db, 'reminders'), orderByChild('eventId'), equalTo(eventId)));
};

/**
 * Update the reminder interval and schedule the next reminder date.
 *
 * @param {string} reminderOn - The current reminder date and time.
 * @param {string} interval - The new reminder interval ('weekly', 'monthly', 'yearly', 'daily').
 * @param {string} reminderId - The ID of the reminder to update.
 * @param {string} userName - The username of the owner of the reminder.
 * @returns {Promise<void>} A promise that resolves when the reminder is updated.
 */
export const updateReminderInterval = (reminderOn, interval, reminderId, userName) => {
  const owner = userName.toLowerCase();
  const updates = {};
  updates[`reminders/${reminderId}/reminderOn`] = updateReminder(reminderOn, interval);
  updates[`users/${owner}/reminders/${reminderId}`] = updateReminder(reminderOn, interval);

  return update(ref(db), updates);
};

/**
 * Calculate and return the next reminder date based on the current reminder date and interval.
 *
 * @param {string} reminderOn - The current reminder date and time.
 * @param {string} interval - The reminder interval ('weekly', 'monthly', 'yearly', 'daily').
 * @returns {string} The next reminder date.
 */
function updateReminder(reminderOn, interval) {
  let nextReminderDate;
  const remindOnDate = parseISO(reminderOn);

  if (interval === 'weekly') {
    nextReminderDate = addWeeks(remindOnDate, 1);
  } else if (interval === 'monthly') {
    nextReminderDate = addMonths(remindOnDate, 1);
  } else if (interval === 'yearly') {
    nextReminderDate = addYears(remindOnDate, 1);
  } else if (interval === 'daily') {
    nextReminderDate = addDays(remindOnDate, 1);
  }

  return nextReminderDate;
}

/**
 * Remove a reminder from the database by its ID.
 *
 * @param {string} reminderId - The ID of the reminder to remove.
 * @returns {Promise<void>} A promise that resolves when the reminder is removed.
 */
export const removeReminder = (reminderId) => {
  const updates = {};
  updates[`reminders/${reminderId}`] = null;

  return update(ref(db), updates);
};

/**
 * Create a reminder for an event.
 *
 * @param {string} eventId - The ID of the associated event.
 * @param {boolean} recurring - Whether the reminder is recurring.
 * @param {string} reminderOn - The reminder date and time.
 * @param {string} owner - The owner's username.
 * @param {string} description - The reminder description.
 * @param {string} title - The title of the event.
 */
export const createReminder = (eventId, recurring, reminderOn, owner, description, title) => {
  const userName = owner.toLowerCase();
  push(ref(db, 'reminders'), {
    eventId,
    recurring,
    reminderOn,
    userName,
    description,
    title,
  }).then((reminder) => {
    const reminderKey = reminder.key;
    const updates = {};
    updates[`users/${owner}/reminders/${reminderKey}`] = reminderOn;
    updates[`reminders/${reminderKey}/reminderId`] = reminderKey;
    return update(ref(db), updates);
  }).catch((error) => {
    console.error('Error creating reminder', error);
  });
};
