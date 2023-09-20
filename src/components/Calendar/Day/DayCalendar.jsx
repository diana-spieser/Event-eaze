import { useState } from 'react';
import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { format, addDays, subDays } from 'date-fns';
import CalendarNavigation from '../CalendarNavigation';
import TimeIntervals from '../TimeIntervals';
import DayColumn from './DayColumn';
import holidays from 'date-holidays';

const DayCalendar = () => {
  const [momentDate, setMomentDate] = useState(new Date());
  const hd = new holidays();
  hd.init('BG'); 
  hd.setLanguages('en');
  const isHoliday = hd.isHoliday(new Date(momentDate));

  const prevDay = () => {
    const newDay = subDays(momentDate, 1);
    setMomentDate(newDay);
  };

  const nextDay = () => {
    const newDay = addDays(momentDate, 1); 
    setMomentDate(newDay);
  };

  const todayDate = () => {
    setMomentDate(new Date());
  };

  return (
    <Box>
      <CalendarNavigation         
        onPrev={ prevDay }
        onNext={ nextDay } 
        title={ 'Day' } 
        today= { todayDate }
      />
      <Flex fontWeight={ 'bold' } fontSize='20px' justify={ 'center' } mt={ 2 }>
        <Box color={ momentDate.toDateString() === new Date().toDateString() ? 
          '#ff5414' : 'inherit' }
        >
          {format(momentDate, 'MMMM d, yyyy')}
          <Text textAlign='center' fontSize={ 11 } color={ '#f58256' }>{isHoliday.length && isHoliday[0].name}</Text> 
        </Box>
      </Flex>
      
      <Box height={ '65vh' } overflowY={ 'scroll' } position='relative' >
        <Flex
          alignItems='center'
          justifyContent='center'         
          mt={ 2 }
        >
          <Grid templateRows='repeat(48, 30px)' textAlign={ 'right' } >
            <TimeIntervals />
          </Grid>
          <DayColumn momentDate={ momentDate } />
        </Flex>
      </Box>
    </Box>
  );
};

export default DayCalendar;
