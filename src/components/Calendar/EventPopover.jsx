import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Text, VStack, PopoverCloseButton, useDisclosure, Divider } from '@chakra-ui/react';
import { format } from 'date-fns';
import { deleteEvent } from '../../services/event.services';
import PopoverContentComponent from '../Event/DisplaySingleEvent/PopoverContentComponent';
import ConfirmationAlert from '../Base/ConfirmationAlert';
import PropTypes from 'prop-types';

const EventPopover = ({ event, userData, setOnEdit }) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { onToggle } = useDisclosure();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleEditEventSuccess = () => {
    closeModal();
    setOnEdit(prev => !prev);
  };

  const handleDelete = (eventId) => {
    deleteEvent(eventId);
    navigate('/calendar');
  };

  return (
    <Box p={ 2 } textAlign='center' borderWidth='1px' borderRadius='md' boxShadow='md'>
      <VStack>
        <PopoverCloseButton />  
      </VStack>
         
      <VStack spacing={ 2 } align='center' >
        <Text fontWeight='bold' fontSize='ml'> Event:</Text>
        <Text>{event.title}</Text>
        <Text>
          <strong>By:</strong> {event.userName}
        </Text>
        <Text>
          <strong>Start:</strong>{' '}
          {format(new Date(event.startDate), 'MMM dd yyyy HH:mm', {
            timeZoneName: 'short',
          })}
        </Text>
        <Text>
          <strong>End:</strong>{' '}
          {format(new Date(event.endDate), 'MMM dd yyyy HH:mm', {
            timeZoneName: 'short',
          })}
        </Text>
        <Divider />
        <Text color='#ff5414' cursor={ 'pointer' } onClick={ () => navigate(`/events/${event.id}`) }>
          More information
        </Text>
        <PopoverContentComponent
          event={ event }
          userData={ userData }
          onClose={ onToggle }
          onEditClick={ openModal }
          onDeleteClick={ () => setShowDeleteAlert(true) }
          isModalOpen={ isModalOpen }
          openModal={ openModal }
          handleEditEventSuccess={ handleEditEventSuccess }
          closeModal={ closeModal }      
        />
        <ConfirmationAlert
          isOpen={ showDeleteAlert }
          onClose={ () => setShowDeleteAlert(false) }
          onDelete={ () => handleDelete(event.id) }
          message='Are you sure you want to delete this event? This action cannot be undone.'
        />
      </VStack>
    </Box>
  );
};

EventPopover.propTypes = {
  event: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  setOnEdit: PropTypes.func,
};

export default EventPopover;
