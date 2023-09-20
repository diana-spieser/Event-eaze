import { useState, useEffect, useContext } from 'react';
import { getNotification } from '../../services/event.services';
import { markNotificationRead } from '../../services/user.service';
import { getReminderById, removeReminder, updateReminderInterval } from '../../services/reminder.service';
import { MenuList, Flex, MenuItem, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { isSameDay, isAfter, parseISO } from 'date-fns';
import colors from '../../theme/colors';
import ReminderContent from './ReminderContent';
import NotificationContent from './NotificationContent';
import AuthContext from '../../context/AuthContext';
import PropTypes from 'prop-types';

function NotificationWindow({ setNotificationCount }) {
  const { userData } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    if(userData?.notifications) {
      const notificationPromises = Object.keys(userData.notifications)
        .map(notification => getNotification(notification));

      Promise.all(notificationPromises)
        .then(snapshots => {
          const notificationPromise = snapshots.map(snapshot => snapshot.val())
            .filter(snapshot => snapshot !== null);
          
          setNotifications(notificationPromise);
        })
        .catch(e => console.error('Error getting notifications:', e));

    } else {
      setNotifications([]);
    }
  },[userData?.notifications]);
  
  useEffect(() => {
    if(userData?.reminders) {
      const reminderPromises = [];
      for(const [key, reminderDate] of Object.entries(userData?.reminders)) {
        if (isSameDay(currentDateTime, parseISO(reminderDate)) && isAfter(currentDateTime, parseISO(reminderDate))) {
          reminderPromises.push(getReminderById(key));
        }
      }
      if (reminderPromises.length > 0) {
        Promise.all(reminderPromises)
          .then(snapshots => {
            const resolvedPromises = snapshots
              .map(snapshot => snapshot.val());
                            
            setReminders(resolvedPromises);
          })
          .catch(e => console.error('Error getting notifications:', e));
      }
    }
  },[userData?.reminders, currentDateTime]);

  useEffect(() => {
    if (userData?.reminders) {
      const interval = setInterval(() => {
        setCurrentDateTime(new Date());

      }, 45000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [userData?.reminders]);

  useEffect(() => {
    if (notifications.length > 0 || reminders.length > 0) {
      const length = reminders.length + notifications.length;
      document.title = `Event Eaze (${length})`;
      setNotificationCount(length);
    } else {
      document.title = 'Event Eaze';
      setNotificationCount(0);
    }

    return () => {
      document.title = 'Event Eaze';
      setNotificationCount(0);
    };
  }, [notifications, reminders]);

  const handleEventSeen = (eventId, notificationId) => {
    markNotificationRead(userData.userName, 'notifications', notificationId)
      .then(() => {
        navigate(`/events/${eventId}`);
      })
      .catch(error => {
        console.error('Error marking notification as read:', error);
      });
  };

  const handleReminderSeen = (reminderOn, interval, reminderId, eventId, userName) => {
    if(interval !== 'never') {
      updateReminderInterval(reminderOn, interval, reminderId, userName)
        .then(() => {
          setReminders(prevReminders => prevReminders.filter(reminder => reminder.reminderId !== reminderId));
          navigate(`/events/${eventId}`);
        })
        .catch(error => {
          console.error('Error marking notification as read:', error);
        });
    } else {
      markNotificationRead(userData.userName, 'reminders', reminderId)
        .then(() => {
          removeReminder(reminderId);
          setReminders(prevReminders => prevReminders.filter(reminder => reminder.reminderId !== reminderId));
        })
        .then(() => {
          navigate(`/events/${eventId}`);
        })
        .catch(error => {
          console.error('Error marking notification as read:', error);
        });
    }
  };

  const background = useColorModeValue( colors.light.bg.primary , colors.dark.bg.primary );

  return (
    <MenuList p='16px 8px' backgroundColor={ background }>
      <Flex flexDirection='column'
        maxH={ '400px' }
        overflowY='auto' css={ {
          '&::-webkit-scrollbar': {
            width: '7px',
          },
          '&::-webkit-scrollbar-track': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'grey',
            borderRadius: '24px',
          },
        } }>
        {reminders.length > 0 && reminders.map(reminder => {
          return (<MenuItem borderRadius='8px' mb='10px' key={ reminder.reminderId }
            onClick={ () => handleReminderSeen(reminder.reminderOn, reminder.recurring,
              reminder.reminderId, reminder.eventId, reminder.userName) }  >
            <ReminderContent
              title={ reminder.title }
              description= { reminder.description }
              reminderOn={ reminder.reminderOn }
            />
          </MenuItem>);
        })}
        {notifications.length > 0 && notifications.map(notification => {

          return (
            <MenuItem borderRadius='8px' mb='10px' key={ notification.notificationId }
              onClick={ () => handleEventSeen(notification.eventId, notification.notificationId) }  >
              <NotificationContent
                author={ notification.userName }
                avatar={ notification.ownerAvatar }
                title={ notification.title }
                date={ notification.startDate }
              />
            </MenuItem>
          );})}
        {notifications.length < 1 && reminders.length < 1 && (
          <MenuItem>
          No new notifications.
          </MenuItem>
        )}
      </Flex>
    </MenuList>
  );
}

export default NotificationWindow;

NotificationWindow.propTypes = {
  setNotificationCount: PropTypes.func,
};
