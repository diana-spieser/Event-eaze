import { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ConfirmationAlert = ({ isOpen, onClose, onDelete, message }) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={ isOpen }
      leastDestructiveRef={ cancelRef }
      onClose={ onClose }
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Are you sure?
          </AlertDialogHeader>

          <AlertDialogCloseButton />

          <AlertDialogBody>{message}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={ cancelRef } onClick={ onClose }>
              Cancel
            </Button>
            <Button colorScheme='red' onClick={ onDelete } ml={ 3 }>
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

ConfirmationAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  message: PropTypes.string,
};

export default ConfirmationAlert;
