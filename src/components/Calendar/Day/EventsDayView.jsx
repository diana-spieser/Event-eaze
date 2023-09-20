import { useState, useEffect } from 'react';
import { GridItem, Box, Text, useMediaQuery, Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { getEventsByUserName } from '../../../services/event.services';
import {
  differenceInMinutes,
  isSameDay,
  startOfDay,
  addDays,
  isBefore,
  isAfter,
  getDay,
  getDate,
} from 'date-fns';
import EventPopover from '../EventPopover';
import PropTypes from 'prop-types'; 

const EventsDayView = ({ user, momentDate }) => {
  const [events, setEvents] = useState([]);
  const [isMobile] = useMediaQuery('(max-width: 670px)');
  const [onEdit, setOnEdit] = useState(false);

  const eventRepeatsOnCurrentDay = (event) => {
    const eventStartDate = event.startDate;

    if (event.reoccurring === 'daily' &&  eventStartDate <= momentDate) {
      return true;
    } else if (event.reoccurring === 'weekly' && eventStartDate <= momentDate) {
      return getDay(momentDate) === getDay(eventStartDate);
    } else if (event.reoccurring === 'monthly' && eventStartDate <= momentDate) {
      return getDate(momentDate) === getDate(eventStartDate);
    } else {
      return isSameDay(eventStartDate, momentDate);
    }
  };

  useEffect(() => {
    if (user?.userName) {
      getEventsByUserName(user?.userName)
        .then((eventData) => {
          const filteredEvents = eventData.filter((event) => {
            if (isSameDay(event.startDate, event.endDate)) {
              return eventRepeatsOnCurrentDay(event);
            } else {
              return (
                (isBefore(event.startDate, addDays(momentDate, 1)) &&
                isAfter(event.endDate, momentDate)) ||
              isSameDay(event.startDate, momentDate) ||
              isSameDay(event.endDate, momentDate)
              );
            }
          });
          setEvents(filteredEvents);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [user?.userName, momentDate, user?.events, onEdit]);

  if (!events) {
    return null;
  }
  
  return (
    <>
      {events.map((event) => {
        const eventStartDate = event.startDate;
        const eventEndDate = event.endDate;
        const isMultiDayEvent = !isSameDay(eventStartDate, eventEndDate);
        const startOfCurrentDay = startOfDay(momentDate);
        let rowStart =
          eventStartDate.getHours() * 2 +
          (eventStartDate.getMinutes() === 30 ? 2 : 1);
        let rowSpan;

        if (isMultiDayEvent) {          
          if (isSameDay(eventStartDate, momentDate)) {
            const minutesUntilEndOfDay = differenceInMinutes(
              addDays(momentDate, 1),
              eventStartDate
            );

            rowSpan = minutesUntilEndOfDay / 30;
          } else if (isSameDay(eventEndDate, momentDate)) {
            const minutesFromStartOfDay = differenceInMinutes(
              eventEndDate,
              startOfCurrentDay
            );
            rowStart = 1; 
            rowSpan = minutesFromStartOfDay / 30;
          } else if (
            eventStartDate < startOfCurrentDay &&
            eventEndDate > addDays(momentDate, 1)
          ) {
            rowStart = 1; 
            rowSpan = 48; 
          } else {
            rowStart = 1; 
            rowSpan = 0; 
          }
        } else { 
          rowSpan = differenceInMinutes(eventEndDate, eventStartDate) / 30;
        }

        return (
          <GridItem
            key={ event.id }
            rowStart={ rowStart }
            rowSpan={ Math.ceil(rowSpan) }
            overflow='hidden'
            zIndex={ 5 }
            bg={ '#6693f2' } 
            opacity={ 0.9 }
            borderRadius='md'
            boxShadow='lg'
          >
            <Popover>
              <PopoverTrigger>
                <Box
                  fontWeight='bold'
                  textAlign='center'
                  cursor='pointer' 
                  userSelect='none'
                  fontSize={ 13 }
                >
                  <Text width={ isMobile ? 11 : 'auto' }>{event.title}</Text>
                </Box>
              </PopoverTrigger>
              <PopoverContent>
                <EventPopover event={ event } userData={ user } setOnEdit={ setOnEdit } />
              </PopoverContent>
            </Popover>     
          </GridItem>
        );
      })}
    </>
  );
};

EventsDayView.propTypes = {
  user: PropTypes.object, 
  momentDate: PropTypes.object, 
};
export default EventsDayView;
