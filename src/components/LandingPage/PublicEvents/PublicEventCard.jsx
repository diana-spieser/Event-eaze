import {
  SimpleGrid,
  Box,
  Image,
  Text,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaCalendar } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { HiStatusOnline } from 'react-icons/hi';
import { calculateEventValues } from '../../../common/helpers/eventUtils';

import PropTypes from 'prop-types';
import IMAGES from '../../../assets/images/Images';

const PublicEventCard = ({ events }) => {
  const bgColor = useColorModeValue('white', 'blackAlpha.600');
  const eventsArray = Array.isArray(events) ? events : [events];

  return (
    <SimpleGrid columns={ [1, 2, 3, 4] } spacing='25px'>
      {eventsArray.map((event) => {
        const { startDateString, city } = calculateEventValues(event);
        return (
          <Box position='relative' key={ event.id }>
            <Box
              borderWidth='1px'
              shadow='md'
              rounded='lg'
              overflow='hidden'
              bg={ bgColor }
              borderRadius={ 'lg' }
              maxW='25rem'
              margin='0 auto'
              boxShadow='lg'
            >
              <Box position={ 'absolute' } width={ '100%' }>
                <Text
                  textTransform='uppercase'
                  fontWeight={ 600 }
                  fontSize='xs'
                  p={ 1 }
                  borderLeft={ 'none' }
                  borderBottom={ '1px solid' }
                  borderBottomColor='accent.primary'
                  ml={ 2 }
                  width={ 'fit-content' }
                >
                  {event.categoryId}
                </Text>
              </Box>
              <Image
                src={ event.photoUrl ? event.photoUrl : IMAGES.hero }
                width='100%'
                m='auto'
                alt={ event.title }
                mt={ 10 }
              />
              <Box p={ { base: 4, lg: 6 } }>
                <Box d='flex' alignItems='baseline'>
                  <Box
                    fontWeight='semibold'
                    as='h2'
                    letterSpacing='wide'
                    textTransform='uppercase'
                    textAlign={ 'center' }
                  >
                    {event.title}
                  </Box>
                </Box>
                <Box>
                  <Box fontSize='sm'>
                    <Flex
                      flexDir='row'
                      justify='space-between'
                      align='center'
                    >
                      <Box
                        position='absolute'
                        top='5px'
                        right='5px'
                        zIndex='1'
                      >
                        <Text
                          textTransform='uppercase'
                          fontWeight={ 600 }
                          fontSize='sm'
                          bg={ event.isPublic ? 'blue' : '#3700B3' }
                          p={ 1 }
                          pl={ 2 }
                          pr={ 2 }
                          rounded='lg'
                          color='white'
                          m={ 2 }
                        >
                          {event.isPublic ? 'Public' : 'Private'}
                        </Text>
                      </Box>
                    </Flex>
                    <Flex justify={ 'space-between' }>
                      <Flex align='center'>
                        <Box
                          as={ FaCalendar }
                          color='accent.primary'
                          size='14px'
                          mr='2'
                        />
                        <Text>{startDateString}</Text>
                      </Flex>
                      {event.isOnline ? (
                        <Flex align='center'>
                          <Box
                            as={ HiStatusOnline }
                            color='accent.primary'
                            size='14px'
                            mr='2'
                          />
                          <Text>Online</Text>
                        </Flex>
                      ) : (
                        <Flex align='center'>
                          <Box
                            as={ FaLocationDot }
                            color='accent.primary'
                            size='14px'
                            mr='2'
                          />
                          <Text>{city}</Text>
                        </Flex>
                      )}
                    </Flex>
                  </Box>
                </Box>
                <Text
                  mt='1'
                  fontWeight='semibold'
                  noOfLines={ 2 }
                  lineHeight='tight'
                  fontSize='sm'
                >
                  {event.description}
                </Text>
              </Box>
            </Box>
          </Box>
        );
      })}
    </SimpleGrid>
  );
};

export default PublicEventCard;

PublicEventCard.propTypes = {
  events: PropTypes.array.isRequired,
};
