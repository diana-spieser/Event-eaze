import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button,
  Grid, GridItem, Avatar, } from '@chakra-ui/react';
import AVATARS from '../../../assets/avatars/Avatars';
import PropTypes from 'prop-types';

function AvatarSelectionModal({ isOpen, onClose, onSelectAvatar }) {
  const avatars = [
    AVATARS.code,
    AVATARS.friends,
    AVATARS.hobby,
    AVATARS.mountains,
    AVATARS.sport,
    AVATARS.travel,
    AVATARS.work,
    AVATARS.work2,
    AVATARS.music
  ];

  const handleAvatarClick = (imageUrl) => {
    onSelectAvatar(imageUrl);
    onClose();
  };

  return (
    <>
      <Modal isCentered isOpen={ isOpen } onClose={ onClose }>
        <ModalOverlay
          bg='blackAlpha.800'
          backdropFilter='blur(10px) hue-rotate(90deg)'
        />
        <ModalContent>
          <ModalHeader>Choose Avatar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns='repeat(3, 1fr)' gap={ 4 } p={ 4 }>
              {avatars.map((avatarUrl, index) => (
                <GridItem key={ index }>
                  <Avatar
                    src={ avatarUrl }
                    name={ `Avatar ${index + 1}` }
                    size='lg'
                    cursor='pointer'
                    onClick={ () => handleAvatarClick(avatarUrl) }
                  />
                </GridItem>
              ))}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={ onClose }>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

AvatarSelectionModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSelectAvatar: PropTypes.func,
};

export default AvatarSelectionModal;
