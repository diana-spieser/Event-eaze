import  { useState,  useContext } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Text, ModalHeader, } from '@chakra-ui/react';
import AuthContext from '../../../../context/AuthContext';
import CreateEventForm from '../CreateEventForm/CreateEventForm';
import colors from '../../../../theme/colors';
import PropTypes from 'prop-types';

function CreateEventModal({ isOpen, onClose, handleCreteEventSuccess }) {
  const { user } = useContext(AuthContext);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleModalClose = () => {
    onClose();
    setShowSuccessToast(false);
  };

  return (
    <>
      <Modal isOpen={ isOpen } onClose={ handleModalClose } size='3xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign={ 'center' } backgroundColor={ colors.accent.primary } 
            color={ 'white' } letterSpacing={ '0.05em' }> Create New Event</ModalHeader>
          <ModalCloseButton color={ 'white' } mt={ 1 }/>
          <ModalBody mt={ 1 }>
            <CreateEventForm
              currentUser={ user }
              onEventCreated={ handleCreteEventSuccess }
              onClose={ handleModalClose }
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      {showSuccessToast && (
        <Text textAlign='center' color='green.500' mt={ 4 }>
          Event created successfully!
        </Text>
      )}
    </>
  );
}

export default CreateEventModal;

CreateEventModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  handleCreteEventSuccess: PropTypes.func,
  openModal: PropTypes.func,
};
