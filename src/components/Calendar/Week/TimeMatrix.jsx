import { useState, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { addMinutes, differenceInMinutes } from 'date-fns';
import { useColorMode } from '@chakra-ui/react';
import PropTypes from 'prop-types'; 

function TimeMatrix({ showRedLine, gridItemWidth }) {

  const intervals = [];
  const { colorMode } = useColorMode();
  const borderColor = colorMode === 'dark' ? '#27374c' : '#E2E8F0'; 
  for (let hour = 0; hour < 24; hour++) {
    intervals.push(`${hour}:00`, `${hour}:30`);
  }

  const calculateCurrentIndex = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    return currentHour * 2 + Math.floor(currentMinute / 30);
  };

  const calculateTopPosition = () => {
    const now = new Date();
    const currentMinute = now.getMinutes();
    return currentMinute > 30
      ? differenceInMinutes(now, addMinutes(now, -currentMinute)) - 30
      : differenceInMinutes(now, addMinutes(now, -currentMinute));
  };

  const [currentTimeIndex, setCurrentTimeIndex] = useState(calculateCurrentIndex());
  const timeMatrixRef = useRef(null); 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimeIndex(calculateCurrentIndex());
    }, 60000);

    
    if (timeMatrixRef.current && showRedLine) {
      const currentRow = timeMatrixRef.current.querySelector(`[data-index="${currentTimeIndex }"]`);
      if (currentRow) {
        currentRow.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [showRedLine, currentTimeIndex]);

  return (
    <Box ref={ timeMatrixRef } position='absolute' >
      {intervals.map((interval, index) => (
        <Box
          key={ interval }
          data-index={ index } 
          position='relative'
          height={ '30px' }
          border= { `1px solid ${borderColor}` }
          width={  `${gridItemWidth }px` }
        >
          {showRedLine && currentTimeIndex === index && (
            <>
              <Box
                position='absolute'
                left={ 0 }
                top={ `${calculateTopPosition()}px` }
                w={ `${gridItemWidth - 1}px` }  
                height='1.5px'
                background='red'
                zIndex='10'
              />
              <Box
                position='absolute'
                left='-5px'
                top={ `${calculateTopPosition() - 4}px` }
                width='10px'
                height='10px'
                background='red'
                borderRadius='50%'
                zIndex='10'
              /> 
              
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}

TimeMatrix.propTypes = {
  showRedLine: PropTypes.bool, 
  gridItemWidth: PropTypes.number, 
};
export default TimeMatrix;
