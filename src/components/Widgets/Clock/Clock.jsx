import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import ReactClock from 'react-clock';
import 'react-clock/dist/Clock.css';
import './Clock.css';


function MyClock() {

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box display={ 'flex' } justifyContent={ 'center' } mt='66'>
        <ReactClock value={ time } renderNumbers={ true } />
      </Box>
      <Box
        display={ 'flex' }
        justifyContent={ 'center' }
        borderRadius='md'
        bg='accent.primary'
        color='white'
        px={ 4 }
        h={ 8 }
        m='9'
        p='1'
      >
        {time.toLocaleTimeString()}
      </Box>

    </>
  );
}

export default MyClock;
