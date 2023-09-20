import { Text,Box } from '@chakra-ui/react';

function TimeIntervals(){

  const intervals = [];
  for (let hour = 0; hour < 24; hour++) {
    intervals.push(`${hour}:00`, `${hour}:30`);
  }
  
  return (
    < Box mt= { -2 } >
      {intervals.map((interval, index) => (
        <Text 
          key={ interval }
          fontSize={ index % 2 === 0 ? '15px' : '13px' }
          height='30px'
          width={ 'auto' }
          ml={ index % 2 !== 0 ? 2 : 0 }
        >
          {interval}
        </Text>
      ))}
    </Box>
  );
}

export default TimeIntervals;