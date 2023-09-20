import {
  Container,
  Box,
  HStack,
  VStack,
  Stack,
  Text,
  Icon,
  Tag,
  Avatar,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { GoChevronRight } from 'react-icons/go';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const UpcomingEvents = ({ events }) => {
  const bgColor = useColorModeValue('whiteAlpha.900', 'blackAlpha.800');
  return (
    <Container p={ { base: 1, md: 2 } } overflow={ 'hidden' }>
      <VStack spacing={ 4 }>
        <Heading textAlign='center' fontSize='xl' fontWeight='bold' p={ 4 }>
          Upcoming Events
        </Heading>

        {events.map((event, eventId) => (
          <Stack
            key={ eventId }
            direction='column'
            spacing={ 4 }
            p={ 3 }
            borderWidth='1px'
            shadow='md'
            rounded='lg'
            bg={ bgColor }
            w={ '100%' }
          >
            <HStack spacing={ 2 } mb={ 1 }>
              <Tag bg={ 'accent.primary' } color={ 'white' } borderRadius='lg'>
                {event.categoryId}
              </Tag>
              <Tag
                bg={ event.isPublic ? 'blue' : 'green' }
                color={ 'white' }
                borderRadius='lg'
              >
                {event.isPublic ? 'Public' : 'Private'}
              </Tag>
            </HStack>
            <Avatar size='lg' title='Author' mb={ 2 } src={ event.photoUrl } />
            <Box textAlign='left'>
              <Text
                fontSize='xl'
                fontWeight='bold'
                w='100%'
                color='accent.primary'
                _hover={ { color: 'accent.primary', textDecoration: 'underline' } }
                as={ Link }
                to={ `/events/${event.id}` }
              >
                {event.title}
              </Text>
              <Text
                fontSize='md'

                noOfLines={ 1 }
                lineHeight='normal'
              >
                {event.description}
              </Text>
            </Box>
            <Box>
              <Stack
                justify='space-between'
                direction={ { base: 'column', sm: 'row' } }
              >
                <Box>
                  <Text fontSize='sm'>
                    {event.startDate.toLocaleDateString()}
                  </Text>
                </Box>
                <HStack
                  as={ Link }
                  to={ `/events/${event.id}` }
                  spacing={ 1 }
                  p={ 1 }
                  alignItems='center'
                  height='2rem'
                  w='max-content'
                  margin='auto 0'
                  rounded='md'
                  _hover={ { bg: 'accent.primary' } }
                >
                  <Text fontSize='sm'> Read more</Text>
                  <Icon as={ GoChevronRight } w={ 4 } h={ 4 } />
                </HStack>
              </Stack>
            </Box>
          </Stack>
        ))}
      </VStack>
    </Container>
  );
};

export default UpcomingEvents;

UpcomingEvents.propTypes = {
  events: PropTypes.array,
};
