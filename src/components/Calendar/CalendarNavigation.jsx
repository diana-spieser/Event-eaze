import {
  Button,
  Flex,
  Spacer,
  Heading,
  Text,
  useMediaQuery
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types'; 

const CalendarNavigation = ({ onPrev, onNext, title, today }) => {
  const [isMobile] = useMediaQuery('(max-width: 767px)');

  return (
    <Flex align='center' >
      <Button onClick={ onPrev } leftIcon={ <ChevronLeftIcon /> } variant='ghost'>
        <Text fontSize={ isMobile ? '15px' : '18px' }  >Previous {title}</Text>
      </Button>
      <Button ml={ 2 } onClick={ today }>Today</Button>
      <Spacer />
      <Heading as='h2' size='md'>
        <Flex direction={ 'column' }>
          <Text align={ 'center' } fontSize={ isMobile ? '15px' : '18px' }>
          
          </Text>
        </Flex>
      </Heading>
      <Spacer />
      <Button onClick={ onNext } rightIcon={ <ChevronRightIcon /> } variant='ghost'>
        <Text fontSize={ isMobile ? '15px' : '18px' }>Next {title}</Text>
      </Button>
    </Flex>
  );
};

CalendarNavigation.propTypes = {
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  title: PropTypes.string,
  today: PropTypes.func,
};
export default CalendarNavigation;
