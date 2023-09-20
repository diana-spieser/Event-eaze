import  { useState } from 'react';
import { Grid, Box, Text, useMediaQuery } from '@chakra-ui/react';
import { format, isToday, startOfMonth, addDays, startOfWeek } from 'date-fns';
import { Link } from 'react-router-dom';

const SmallCalendar = () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  // eslint-disable-next-line no-unused-vars
  const [year, setYearState] = useState(currentYear);
  const [isMobile] = useMediaQuery('(max-width: 1067px)');
  const months = [new Date(year, currentMonth)];

  return (
    <Link to='/calendar'>
      <Box>
        <Grid
          templateColumns={ isMobile ? 'repeat(1, 1fr)' : 'repeat(1fr)' }
          gap={ 4 }
        >
          {months.map((month) => {
            const firstDayOfMonth = startOfMonth(month);
            const startingDay = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });

            return (
              <Box
                key={ month }
                p={ 3 }
                borderRadius='md'
                boxShadow={ isToday(month) ? 'md' : 'none' }
              >
                <Text fontWeight={ isToday(month) ? 'bold' : 'normal' } color='white'>
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
                        color={ isToday(currentDate) ? 'red.500' : 'white' }
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
    </Link>
  );
};

export default SmallCalendar;
