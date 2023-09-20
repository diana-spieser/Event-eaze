
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AiOutlineCalendar, AiOutlineSound, AiOutlineContacts } from 'react-icons/ai';
import AuthContext from '../../context/AuthContext';

function DashProfile() {
  const { userData } = useContext(AuthContext);

  const now = new Date();
  let greeting = '';

  if (now.getHours() > 5 && now.getHours() <= 12) {
    greeting = 'Good morning';
  } else if (now.getHours() > 12 && now.getHours() <= 18) {
    greeting = 'Good afternoon';
  } else if (now.getHours() > 18 && now.getHours() <= 22) {
    greeting = 'Good evening';
  } else {
    greeting = 'Good night';
  }
  return (
    <Flex direction='column'>
      <Flex
        direction={ { xs: 'column', sm: 'column', md: 'row' } }
        maxH='330px'
        justifyContent={ { xs: 'center', sm: 'center', md: 'space-between' } }
        align='center'
        p='16px'
      >
        <Flex
          align='center'
          mb={ { sm: '10px', md: '0px' } }
          direction={ { sm: 'column', md: 'row' } }
          w={ { sm: '100%' } }
          textAlign={ { sm: 'center', md: 'start' } }
        >
          <Avatar
            me={ { md: '22px' } }
            src={ userData?.photoUrl }
            w='80px'
            h='80px'
            borderRadius='15px'
          />
          <Flex direction='column' maxWidth='100%' my={ { sm: '14px' } }>
            <Text
              fontSize={ { sm: 'lg', lg: 'xl' } }
              color='white'
              fontWeight='bold'
              ms={ { sm: '8px', md: '0px' } }
            >
              {greeting},
            </Text>
            <Text
              fontSize={ { sm: 'lg', md: 'xl' } }
              color='accent.primary'
              fontWeight='semibold'
            >
              {userData?.firstName}!
            </Text>
          </Flex>
        </Flex>
        <Flex
          direction={ { sm: 'column', lg: 'row' } }
          w={ { sm: '100%', md: '50%', lg: 'auto' } }
        >
          <Link to='/calendar'>
            <Button p='0px' bg='accent.primary' variant='no-effects' mr={ 2 }>
              <Flex
                align='center'
                w={ { sm: '100%', lg: '135px' } }
                color='white'
                borderRadius='8px'
                justifyContent='center'
                py='10px'
                boxShadow='0px 2px 5.5px rgba(0, 0, 0, 0.06)'
                cursor='pointer'
              >
                <Icon as={ AiOutlineCalendar } me='6px' />
                <Text fontSize='xs' fontWeight='bold'>
                  Calendar
                </Text>
              </Flex>
            </Button>
          </Link>
          <Link to='/events'>
            <Button p='0px' bg='accent.primary' variant='no-effects' mr={ 2 }>
              <Flex
                align='center'
                w={ { sm: '100%', lg: '135px' } }
                color='white'
                borderRadius='15px'
                justifyContent='center'
                py='10px'
                mx={ { lg: '1rem' } }
                cursor='pointer'
              >
                <Icon as={ AiOutlineSound } me='6px' />
                <Text fontSize='xs' fontWeight='bold'>
                  Events
                </Text>
              </Flex>
            </Button>
          </Link>
          <Link to='/contacts'>
            <Button p='0px' bg='accent.primary' variant='no-effects'>
              <Flex
                align='center'
                w={ { lg: '135px' } }
                borderRadius='15px'
                justifyContent='center'
                py='10px'
                cursor='pointer'
                color='white'
              >
                <Icon as={ AiOutlineContacts } me='6px' />
                <Text fontSize='xs' fontWeight='bold'>
                  Contacts
                </Text>
              </Flex>
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DashProfile;
