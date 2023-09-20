import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@chakra-ui/react';
import EditEventForm from '../EditEventForm/EditEventForm';
import PropTypes from 'prop-types';


function EditEventModal({ isOpen, onClose, handleEditEventSuccess, event }) {  
  return (
    <Modal isOpen={ isOpen } onClose={ onClose } size='3xl'>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign='center'>Edit Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditEventForm
            event={ event }
            onClose={ onClose }
            handleEditEventSuccess={ handleEditEventSuccess }
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

EditEventModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  event: PropTypes.object,
  handleEditEventSuccess: PropTypes.func,
};

export default EditEventModal;
