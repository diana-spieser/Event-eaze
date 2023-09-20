import { Box, Text, Grid, GridItem, useMediaQuery } from '@chakra-ui/react';
import { format, isToday } from 'date-fns';
import DayColumn from '../Day/DayColumn';
import holidays from 'date-holidays';
import PropTypes from 'prop-types'; 

const WeekColumn = ({ date }) => {
  const [isMobile] = useMediaQuery('(max-width: 1067px)');
  const hd = new holidays();
  hd.init('BG');
  hd.setLanguages('en');
  const isHoliday = hd.isHoliday(new Date(date));

  const getDayNumberWithSuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return `${day}th`;
    }
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  return (
    <Grid templateRows='40px 8fr'>
      <GridItem>
        <Box
          align='center'
          mt={ isMobile ? '-8' : '-5' }
          position='sticky'
          top={ 0 }
          zIndex={ 2 }
        >
          <Text color={ isToday(date) ? '#ff5414' : 'inherit' }>
            {format(date, 'MMM')}
          </Text>
          <Text
            width='11vw'
            fontWeight='bold'
            color={
              isToday(date) ? '#ff5414' : isHoliday ? '#f58256' : 'inherit'
            }
          >
            {getDayNumberWithSuffix(format(date, 'd'))}{' '}
            {isMobile ? format(date, 'E') : format(date, 'EEEE')}
          </Text>
          <Text fontSize={ isMobile ? 7 : 11 } mt={ -1 } color={ '#f58256' }>
            {isHoliday.length && isHoliday[0].name}
          </Text>
        </Box>
      </GridItem>
      <GridItem rowStart={ 2 } borderColor='white'>
        <DayColumn momentDate={ date } />
      </GridItem>
    </Grid>
  );
};
WeekColumn.propTypes = {
  date: PropTypes.object
};
export default WeekColumn;
