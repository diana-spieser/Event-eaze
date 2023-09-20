import { Box, Heading, Text, Button } from '@chakra-ui/react';
import colors from '../../theme/colors';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  const goToHome = () => {
    navigate('/');
  };
  
  return (
    <Box textAlign='center' py={ 10 } px={ 6 }>
      <Heading
        display='inline-block'
        as='h2'
        size='2xl'
        backgroundClip='text'
        color={ colors.accent.primary }
      >
        404
      </Heading>
      <Text fontSize='18px' mt={ 3 } mb={ 2 }>
        Page Not Found
      </Text>
      <Text color={ 'gray.500' } mb={ 6 }>
        The page you&apos;re looking for does not seem to exist
      </Text>
      <Button
        color='white'
        variant='solid'
        onClick={ goToHome }
        bg={ colors.accent.primary }
      >
        Go to Home
      </Button>
    </Box>
  );
}

export default NotFound;