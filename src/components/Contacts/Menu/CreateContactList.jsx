import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { createContactList } from '../../../services/contacts.service';
import { Button, FormControl, Input, Stack, Avatar, Center, HStack, } from '@chakra-ui/react';
import AvatarSelectionModal from './AvatarSelectionModal';
import AuthContext from '../../../context/AuthContext';
import IMAGES from '../../../assets/images/Images';

function CreateContactList() {
  const { userData } = useContext(AuthContext);
  const [isAvatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const { handleSubmit, register, reset } = useForm();

  const handleOpenAvatarModal = () => {
    setAvatarModalOpen(true);
  };

  const onSubmit = (data) => {
    const { title } = data;
    createContactList(title, userData?.userName, selectedAvatar);
    reset();
    setSelectedAvatar(null);
  };

  return (
    <form onSubmit={ handleSubmit(onSubmit) }>
      <HStack>       
        <Stack  
          onMouseEnter={ () => setIsHovered(true) }
          onMouseLeave={ () => setIsHovered(false) }>
          <Avatar size='md' src={ selectedAvatar || IMAGES.hero }>
            {isHovered && (
              <Center
                onClick={ handleOpenAvatarModal }
                position='absolute'
                top='0'
                left='0'
                right='0'
                bottom='0'
                bg='rgba(0, 0, 0, 0.5)'
                borderRadius='50%'
                cursor='pointer'
              >
                +
              </Center>
            )}
          </Avatar>    
        </Stack>        
        <AvatarSelectionModal
          isOpen={ isAvatarModalOpen }
          onOpen={ () => setAvatarModalOpen(true) }
          onClose={ () => setAvatarModalOpen(false) }
          onSelectAvatar={ (avatarUrl) => setSelectedAvatar(avatarUrl) }
        />
        <FormControl id='listName' isRequired>
          <Input
            placeholder='List name'
            _placeholder={ { color: 'gray.500' } }
            type='text'
            { ...register('title') }
            w={ 'full' }
          />
        </FormControl>    
        <Button
          type='submit' 
          bg={ 'blue.400' }
          color={ 'white' }
          _hover={ {
            bg: 'blue.500',
          } }
        >
            +
        </Button>
      </HStack>
    </form>
  );
}

export default CreateContactList;
