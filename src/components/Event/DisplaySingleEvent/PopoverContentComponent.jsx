
import { PopoverHeader, PopoverBody, PopoverCloseButton, IconButton, Button, Tooltip, } from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditEventModal from '../EditEvent/EditEventModal/EditEventModal';
import PropTypes from 'prop-types';

const PopoverContentComponent = ({
  event,
  userData,
  onEditClick,
  onDeleteClick,
  isModalOpen,
  closeModal,
  handleEditEventSuccess,
}) => {

  const shouldSeeEditButton = userData?.userName.toLowerCase() === event.userName 
  || (event.editors && userData?.userName.toLowerCase() in event.editors) ||
  userData?.role === 'Admin';

  return (
    <>
      {shouldSeeEditButton && ( 
        <>
          <PopoverHeader>Choose an action:</PopoverHeader><PopoverCloseButton /><PopoverBody>
            <Tooltip label='Edit' hasArrow>
              <IconButton
                as={ Button }
                aria-label='Edit'
                colorScheme='gray'
                rounded='full'
                icon={ <FaEdit /> }
                mr={ 3 }
                onClick={ onEditClick }
              >
            Edit
              </IconButton>
            </Tooltip>
            <EditEventModal
              isOpen={ isModalOpen }
              onClose={ closeModal }
              handleEditEventSuccess={ handleEditEventSuccess }
              event={ event } />
            {userData &&
          (event.authorId === userData?.uid || userData?.role === 'Admin') && (
              <Tooltip label='Delete' hasArrow>
                <IconButton
                  as={ Button }
                  aria-label='Delete'
                  colorScheme='gray'
                  rounded='full'
                  icon={ <FaTrash /> }
                  mr={ 3 }
                  onClick={ onDeleteClick }
                >
                Delete
                </IconButton>
              </Tooltip>
            )}
          </PopoverBody>
        </>
      )}
    </>
  );
};

export default PopoverContentComponent;

PopoverContentComponent.propTypes = {
  event: PropTypes.object,
  userData: PropTypes.object,
  closeModal: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  isModalOpen: PropTypes.bool,
  handleEditEventSuccess: PropTypes.func,
};
