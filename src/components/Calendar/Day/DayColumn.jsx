import { useState, useEffect, useRef, useContext } from 'react';
import { Grid } from '@chakra-ui/react';
import { getEventsByUserName } from '../../../services/event.services';
import { isSameDay } from 'date-fns';
import TimeMatrix from '../Week/TimeMatrix';
import AuthContext from '../../../context/AuthContext';
import EventsDayView from './EventsDayView';
import PropTypes from 'prop-types'; 

const DayColumn = ({ momentDate }) => {
  const { userData } = useContext(AuthContext);
  const [gridItemWidth, setGridItemWidth] = useState(null);
  const [events, setEvents] = useState([]);
  const timeWidthRef = useRef(null);

  const updateGridItemWidth = () => {
    if (timeWidthRef.current) {
      const width = timeWidthRef.current.getBoundingClientRect().width;
      setGridItemWidth(width);
    }
  };

  useEffect(() => {
    updateGridItemWidth();
    window.addEventListener('resize', updateGridItemWidth);
   
    return () => {
      window.removeEventListener('resize', updateGridItemWidth);
    };
  }, [events]);

  useEffect(() => {
    if (userData?.userName) {
      getEventsByUserName(userData?.userName)
        .then((eventData) => {
          const filteredEvents = eventData.filter((event) => isSameDay(event.startDate, momentDate));
          setEvents(filteredEvents);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userData?.userName, momentDate]);

  if (!events) {
    return null;
  }

  return (
    <Grid ref={ timeWidthRef } templateRows='repeat(48, 30px)' width='100%' ml='5px'>
      <TimeMatrix showRedLine={ isSameDay(momentDate, new Date()) } gridItemWidth={ gridItemWidth } />
      <EventsDayView  momentDate={ momentDate } user={ userData } />
    </Grid>
  ); 
};

DayColumn.propTypes = {
  momentDate: PropTypes.object
};
export default DayColumn;
