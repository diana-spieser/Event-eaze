import {
  Box,
  Stack,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
  Icon,
} from '@chakra-ui/react';
import {
  FaArrowCircleRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaUser,
} from 'react-icons/fa';


function FeaturesCards() {
  return (
    <Box py={ 12 }>
      <VStack spacing={ 2 } textAlign='center'>
        <Heading as='h2' fontSize='4xl'>
          Our Powerful tools
        </Heading>
        <Text fontSize='lg' >
          Make planning, managing, and promoting events a breeze. Say goodbye to
          event chaos and welcome clarity with Event Eaze.
        </Text>
      </VStack>
      <Stack
        direction={ { base: 'column', md: 'row' } }
        textAlign='center'
        justify='center'
        spacing={ { base: 4, lg: 10 } }
        py={ 10 }
      >
        <Box
          mb={ 4 }
          shadow='base'
          borderWidth='1px'
          alignSelf={ { base: 'center', lg: 'flex-start' } }
          borderColor={ useColorModeValue('gray.200', 'gray.500') }
          borderRadius={ 'xl' }
        >
          <Box py={ 4 } px={ 12 }>
            <Text fontWeight='500' fontSize='2xl'>
              Personal Planner
            </Text>
            <HStack justifyContent='center'>
              <Icon
                as={ FaCalendarAlt }
                color='accent.primary
                '
                boxSize={ '10' }
                mt={ 2 }
                _hover={ { color: 'accent.primary' } }
              />
            </HStack>
          </Box>
          <VStack
            bg={ useColorModeValue('gray.50', 'gray.700') }
            py={ 4 }
            borderBottomRadius={ 'xl' }
          >
            <List spacing={ 3 } textAlign='start' px={ 12 }>
              <ListItem>
                <ListIcon as={ FaCheckCircle } color='accent.primary
                ' />
                Schedule your day
              </ListItem>
              <ListItem>
                <ListIcon as={ FaCheckCircle } color='accent.primary
                ' />
                Never miss important events
              </ListItem>
              <ListItem>
                <ListIcon as={ FaCheckCircle } color='accent.primary
                ' />
                Stay organized
              </ListItem>
            </List>
          </VStack>
        </Box>
        <Box
          mb={ 4 }
          shadow='base'
          borderWidth='1px'
          alignSelf={ { base: 'center', lg: 'flex-start' } }
          borderColor={ useColorModeValue('gray.200', 'gray.500') }
          borderRadius={ 'xl' }
        >
          <Box position='relative'>
            <Box
              position='absolute'
              top='-16px'
              left='50%'
              style={ { transform: 'translate(-50%)' } }
            >
              <Text
                textTransform='uppercase'
                bg={ 'accent.primary' }
                px={ 3 }
                py={ 1 }
                color={ 'white' }
                fontSize='sm'
                fontWeight='600'
                rounded='lg'
              >
                Most Popular
              </Text>
            </Box>
            <Box py={ 4 } px={ 12 }>
              <Text fontWeight='500' fontSize='2xl'>
                Event Organizer
              </Text>
              <HStack justifyContent='center'>
                <Icon
                  as={ FaArrowCircleRight }
                  color='accent.primary
                  '
                  boxSize={ '10' }
                  mt={ 2 }
                  _hover={ { color: 'accent.primary' } }
                />
              </HStack>
            </Box>
            <VStack
              bg={ useColorModeValue('gray.50', 'gray.700') }
              py={ 4 }
              borderBottomRadius={ 'xl' }
            >
              <List spacing={ 3 } textAlign='start' px={ 12 }>
                <ListItem>
                  <ListIcon as={ FaCheckCircle } color='accent.primary
                  ' />
                  Create private events
                </ListItem>
                <ListItem>
                  <ListIcon as={ FaCheckCircle } color='accent.primary
                  ' />
                  Add public events
                </ListItem>
                <ListItem>
                  <ListIcon as={ FaCheckCircle } color='accent.primary
                  ' />
                  Manage participants
                </ListItem>
              </List>
            </VStack>
          </Box>
        </Box>
        <Box
          mb={ 4 }
          shadow='base'
          borderWidth='1px'
          alignSelf={ { base: 'center', lg: 'flex-start' } }
          borderColor={ useColorModeValue('gray.200', 'gray.500') }
          borderRadius={ 'xl' }
        >
          <Box py={ 4 } px={ 12 }>
            <Text fontWeight='500' fontSize='2xl'>
              Contact Integration
            </Text>
            <HStack justifyContent='center'>
              <Icon
                as={ FaUser }
                color='accent.primary'
                boxSize={ '10' }
                mt={ 2 }
                _hover={ { color: 'accent.primary' } }
              />
            </HStack>
          </Box>
          <VStack
            bg={ useColorModeValue('gray.50', 'gray.700') }
            py={ 4 }
            borderBottomRadius={ 'xl' }
          >
            <List spacing={ 3 } textAlign='start' px={ 12 }>
              <ListItem>
                <ListIcon as={ FaCheckCircle } color='accent.primary
                ' />
                Invite all your contacts
              </ListItem>
              <ListItem>
                <ListIcon as={ FaCheckCircle } color='accent.primary
                ' />
                Manage your contact list
              </ListItem>
              <ListItem>
                <ListIcon as={ FaCheckCircle } color='accent.primary' />
                Send invites to your events
              </ListItem>
            </List>
          </VStack>
        </Box>
      </Stack>
    </Box>
  );
}

export default FeaturesCards;
