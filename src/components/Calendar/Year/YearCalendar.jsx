import { useState } from 'react';
import { Grid, Box, Text, useMediaQuery, useColorMode } from '@chakra-ui/react';
import { format, isToday, startOfMonth, addDays, startOfWeek , isSameMonth } from 'date-fns';
import CalendarNavigation from '../CalendarNavigation';

const YearCalendar = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const [year, setYearState] = useState(currentYear); 
  const [isMobile] = useMediaQuery('(max-width: 1067px)');
  const { colorMode } = useColorMode();
  const borderColor = colorMode === 'dark' ? '#27374c' : '#E2E8F0'; 

  const months = Array.from({ length: 12 }).map((_, i) => new Date(year, i)); 

  const prevYear = () => {
    const newYear = year - 1;
    setYearState(newYear); 
  };

  const nextYear = () => {
    const newYear = year + 1;
    setYearState(newYear); 
  };

  const thisYear = () => {
    setYearState(currentYear);
  };
  
  return (
    <Box>
      <Box>
        <CalendarNavigation
          onPrev={ prevYear }
          onNext={ nextYear }
          title={ 'Year' }
          today={ thisYear }
        />
      </Box>
      <Grid templateColumns={ isMobile ? 'repeat(1, 1fr)' :'repeat(4, 1fr)' } mt={ 5 } gap={ 4 }>
        {months.map((month) => {
          const firstDayOfMonth = startOfMonth(month);
          const startingDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });

          return (
            <Box
              key={ month }
              border='1px'
              borderColor={ `${borderColor}` }
              p={ 3 }
              borderRadius='md'
              boxShadow={ isToday(month) ? 'md' : 'none' }
            >
              <Text color={ isSameMonth(month, new Date()) ? '#ff5414' : 'inherit' }>
                {format(month, 'MMMM')}
              </Text>
              <Text fontSize='sm' color='gray.500'>
                {format(month, 'yyyy')}
              </Text>
              <Grid templateColumns='repeat(7, 1fr)' gap={ 1 } mt={ 2 }>
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <Text key={ dayIndex } fontSize='sm' color='gray.500'>
                    {format(addDays(startingDay, dayIndex), 'EEE')}
                  </Text>
                ))}
                {Array.from({ length: 42 }).map((_, dayIndex) => {
                  const currentDate = addDays(startingDay, dayIndex);
                  if (currentDate.getMonth() !== month.getMonth()) {
                    return <Text key={ dayIndex } />;
                  }
                  return (
                    <Text
                      key={ dayIndex }
                      fontSize='sm'
                      color={ isToday(currentDate) ? '#ff5414' : 'inherit' }
                      fontWeight={ isToday(currentDate) ? 'bold' : 'normal' }
                    >
                      {format(currentDate, 'd')}
                    </Text>
                  );
                })}
              </Grid>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

export default YearCalendar;
