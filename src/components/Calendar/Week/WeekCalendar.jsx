import {  useState } from 'react';
import { Box,  Flex, Grid, GridItem , Text } from '@chakra-ui/react';
import {
  addDays,
  addWeeks,
  subWeeks,
  startOfWeek,
  getISOWeek,
} from 'date-fns';
import CalendarNavigation from '../CalendarNavigation';
import WeekColumn from './WeekColumn';
import TimeIntervals from '../TimeIntervals';
import PropTypes from 'prop-types'; 

const WeekCalendar = ({ fullWeek }) => {
  const [weekNumber, setWeekNumber] = useState(getISOWeek(new Date()));
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  const days = [];

  let daysInWeek;
  if (fullWeek) {
    daysInWeek = 7;
  } else {
    daysInWeek = 5;
  }

  for (let i = 0; i < daysInWeek; i++) {
    const day = addDays(currentWeek, i);
    days.push(day);
  }

  const prevWeek = () => {
    const newWeek = subWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    updateWeekNumber(newWeek);
  };

  const nextWeek = () => {
    const newWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    updateWeekNumber(newWeek);
  };

  const updateWeekNumber = (date) => {
    const weekNumber = getISOWeek(date);
    setWeekNumber(weekNumber);
  };

  const thisWeek = () => {
    const newWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    setCurrentWeek(newWeek);
    updateWeekNumber(newWeek);
  };


  return (
    <Box>
      <CalendarNavigation
        onPrev={ prevWeek }
        onNext={ nextWeek }
        title={ 'Week' }
        today={ thisWeek }      
      />
      <Flex fontWeight={ 'bold' } fontSize='20px' justify={ 'center' } mb={ 30 }>
        <Text color={ weekNumber === getISOWeek(new Date()) ? '#ff5414' : 'inherit' }>Week: {weekNumber}</Text>
      </Flex>
      <Grid templateColumns={ '60px' } templateRows='40px 1fr'>          
        <GridItem  textAlign={ 'right' } colEnd={ 2 } rowStart={ 2 } >
          <TimeIntervals />
        </GridItem>  
        {days.map((day, index) => (
          <GridItem key={ day } colStart={ 2 + index } >      
            <WeekColumn date={ day }/>
          </GridItem>))}
      </Grid>
    </Box>
  );
};
WeekCalendar.propTypes = {
  fullWeek: PropTypes.bool
};
export default WeekCalendar;