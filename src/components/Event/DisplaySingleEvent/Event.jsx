/* eslint-disable no-unused-vars */
import {
  Container,
  SimpleGrid,
  Image,
  Flex,
  Heading,
  Text,
  Stack,
  StackDivider,
  Icon,
  useColorModeValue,
  useDisclosure,
  ButtonGroup,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
} from '@chakra-ui/react';
import { FaLocationDot } from 'react-icons/fa6';
import { BsFillCalendar2CheckFill, BsFillCalendarXFill } from 'react-icons/bs';
import { FaHouseUser } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa';
import { FaArrowLeft, FaEllipsisH } from 'react-icons/fa';
import { HiStatusOnline } from 'react-icons/hi';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteEvent, getEventById } from '../../../services/event.services';
import { useContext } from 'react';
import { getParticipantsWithUserDetails } from '../../../services/user.service';
import { checkIfUserIsSubscribed, subscribeToEvent, unsubscribeFromEvent,
} from '../../../services/subscription.service';
import { useToast } from '@chakra-ui/react';
import colors from '../../../theme/colors';
import EventDetails from './EventDetails';
import Participants from './Participants';
import EventMap from '../../EventMap/EventMap';
import AuthContext from '../../../context/AuthContext';
import ConfirmationAlert from '../../Base/ConfirmationAlert';
import PopoverContentComponent from './PopoverContentComponent';

const formatDateTime = (dateTimeString) => {
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  return new Date(dateTimeString).toLocaleString(undefined, options);
};

const Event = () => {
  const { userData } = useContext(AuthContext);
  const [event, setEvent] = useState({});
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [participantsWithUserData, setParticipantsWithUserData] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [showUnsubscriptionConfirmation, setShowUnsubscriptionConfirmation] =
  useState(false);
  const navigate = useNavigate();
  const { onToggle } = useDisclosure();
  const { eventId } = useParams();
  const toast = useToast();
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        setLongitude(eventData.longitude);
        setLatitude(eventData.latitude);
        const fetchedParticipantsWithUserData =
          await getParticipantsWithUserDetails(eventData);
        setParticipantsWithUserData(fetchedParticipantsWithUserData);
        const isUserSubscribed = await checkIfUserIsSubscribed(
          eventId,
          userData?.userName
        );

        setIsSubscribed(isUserSubscribed);  
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventId, userData?.userName, onEdit, isSubscribed]);

  const handleSubscribe = () => {
    const lowercasedUserName = userData?.userName?.toLowerCase();
    if (isSubscribed) {
      setShowUnsubscriptionConfirmation(true);
    } else {
      subscribeToEvent(eventId, userData?.userName)
        .then(() => {
          toast({
            title: 'Subscription Successful',
            description: `You are now subscribed to ${event.title}`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });

          setIsSubscribed(true);
        })
        .catch((error) => {
          console.error('Error subscribing:', error);
        });
    }
  };

  const handleUnsubscribe = () => {
    const lowercasedUserName = userData?.userName?.toLowerCase();
    unsubscribeFromEvent(eventId, userData?.userName)
      .then(() => {
        setIsSubscribed(false);
        handleUnsubscriptionConfirmation();   
      })
      .catch((error) => {
        console.error('Error unsubscribing:', error);
      });
  };

  const handleDelete = (eventId) => {
    deleteEvent(eventId);
    navigate('/events');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEditEventSuccess = () => {
    closeModal();
    setOnEdit(prev => !prev);
  };

  const handleUnsubscriptionConfirmation = () => {
    setShowUnsubscriptionConfirmation(prev => !prev);
  };

  const isEventOwner = event.userName === userData?.userName.toLowerCase();
  const isEditor =
  event.editors && userData?.userName.toLowerCase() in event.editors;
  const isAdmin = userData?.role === 'Admin';
  const editorsExist = event.editors && Object.keys(event.editors).length > 0;
  
  return (
    <>
      <Container maxW={ '5xl' } py={ 12 }>
        <SimpleGrid columns={ { base: 1, md: 2 } } spacing={ 10 }>
          <Stack spacing={ 4 }>
            <Flex>
              <Text
                textTransform={ 'uppercase' }
                fontWeight={ 600 }
                fontSize={ 'sm' }
                bg={ event.isPublic ? 'blue' : 'orange' }
                color={ 'white' }
                p={ 2 }
                alignSelf={ 'flex-start' }
                rounded={ 'md' }
                mr={ 2 }
              >
                {' '}
                {event.isPublic ? 'Public Event' : 'Private Event'}
              </Text>
              <Text
                textTransform={ 'uppercase' }
                fontWeight={ 600 }
                fontSize={ 'sm' }
                p={ 2 }
                alignSelf={ 'flex-start' }
                rounded={ 'md' }
                bg={ 'accent.primary' }
                color={ 'white' }
              >
                {' '}
                {event.categoryId}
              </Text>
            </Flex>
            <Heading>{event.title}</Heading>

            <Stack
              spacing={ 4 }
              divider={
                <StackDivider
                  borderColor={ useColorModeValue('gray.100', 'gray.700') }
                />
              }
            >
              {' '}
              {event.isOnline ? (
                <EventDetails
                  icon={
                    <Icon
                      as={ HiStatusOnline }
                      color={ colors.accent.primary }
                      w={ 5 }
                      h={ 5 }
                    />
                  }
                  text={ 'Online Event' }
                />
              ) : (
                <EventDetails
                  icon={
                    <Icon
                      as={ FaLocationDot }
                      color={ colors.accent.primary }
                      w={ 5 }
                      h={ 5 }
                    />
                  }
                  text={ `${event.address}` }
                />
              )}
              <EventDetails
                icon={
                  <Icon
                    as={ BsFillCalendar2CheckFill }
                    color={ colors.accent.primary }
                    w={ 5 }
                    h={ 5 }
                  />
                }
                text={ formatDateTime(event.startDate) }
              />
              <EventDetails
                icon={
                  <Icon
                    as={ BsFillCalendarXFill }
                    color={ colors.accent.primary }
                    w={ 5 }
                    h={ 5 }
                  />
                }
                text={ formatDateTime(event.endDate) }
              />
              <EventDetails
                icon={
                  <Icon
                    as={ FaHouseUser }
                    color={ colors.accent.primary }
                    w={ 5 }
                    h={ 5 }
                  />
                }
                textTransform={ 'uppercase' }
                text={ `Organized by: ${
                  event.userName?.charAt(0).toUpperCase() +
                  event.userName?.slice(1)
                }` }
              />
            </Stack>
            <Stack spacing={ 4 }>
              <Text>{event.description}</Text>
            </Stack>
            <Stack>
              {participantsWithUserData.length > 0 ? (
                <Participants participants={ participantsWithUserData } />
              ) : (
                <Text color='accent.primary'>
                  This event has no participants yet.{' '}
                </Text>
              )}
            </Stack>
          </Stack>
          <Flex>
            <Flex direction={ 'column' } width='100%'>
              <Flex alignItems='center' justify='flex-end' w='100%' ml={ 10 }>
                <Flex
                  justify={ 'flex-end' }
                  direction={ 'column' }
                  align={ 'center' }
                >
                  <ButtonGroup mb={ 6 } mr={ 12 }>
                    <Button
                      leftIcon={ <FaArrowLeft /> }
                      color='white'
                      bg='accent.primary'
                      onClick={ () => navigate(-1) }
                    >
                      Back
                    </Button>
                    {!isEventOwner  && (
                      <Button
                        leftIcon={
                          isSubscribed ? (
                            <BsFillCalendarXFill />
                          ) : (
                            <FaUserPlus />
                          )
                        }
                        color='white'
                        bg='accent.primary'
                        onClick={ handleSubscribe }
                      >
                        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                      </Button>
                    )}
                    {(isEventOwner || (isEditor && editorsExist) || isAdmin) && (
                      <Popover>
                        <PopoverTrigger>
                          <Button
                            rightIcon={ <FaEllipsisH /> }
                            color='white'
                            bg='accent.primary'
                          >
                              More
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverContentComponent
                            event={ event }
                            userData={ userData }
                            onClose={ onToggle }
                            onEditClick={ openModal }
                            onDeleteClick={ () => setShowDeleteAlert(true) }
                            isModalOpen={ isModalOpen }
                            openModal={ openModal }
                            closeModal={ closeModal }
                            handleEditEventSuccess={ handleEditEventSuccess }
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </ButtonGroup>
                </Flex>
              </Flex>
              <Image
                rounded={ 'md' }
                alt={ 'feature image' }
                src={ event.photoUrl }
                objectFit={ 'cover' }
                size={ 'xl' }
                width={ 'full' }
              />
            </Flex>
          </Flex>
        </SimpleGrid>
      </Container>
      <Container maxW={ '5xl' } py={ 12 }>
        {event && <EventMap event={ event } />}
      </Container>
      <ConfirmationAlert
        isOpen={ showDeleteAlert }
        onClose={ () => setShowDeleteAlert(false) }
        onDelete={ () => handleDelete(event.id) }
        message='Are you sure you want to delete this event? This action cannot be undone.'
      />

      <ConfirmationAlert
        isOpen={ showUnsubscriptionConfirmation }
        onClose={ handleUnsubscriptionConfirmation }
        onDelete={ handleUnsubscribe }
        message='Are you sure you want to unsubscribe from this event?'
      />
    </>
  );
};

export default Event;
