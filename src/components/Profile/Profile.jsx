import { useContext, useState } from 'react';
import {
  Heading,
  Avatar,
  Text,
  Button,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerBody,
  DrawerCloseButton,
  DrawerHeader,
  HStack,
  VStack,
  Image,
  Icon,
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import EditProfile from './EditProfile';
import IMAGES from '../../assets/images/Images';
import colors from '../../theme/colors';
import PropTypes from 'prop-types';

function Profile({ isOpen, onClose }) {
  const { userData } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    setEdit((prev) => !prev);
  };

  const close = () => {
    onClose();
    setEdit(false);
  };

  const name = userData?.firstName + ' ' + userData?.lastName;

  return (
    <Drawer isOpen={ isOpen } placement='right' onClose={ close }>
      <DrawerOverlay />
      <DrawerContent maxW={ '375px' } boxShadow={ '2xl' } rounded={ 'lg' }>
        <DrawerCloseButton color='white' />
        <DrawerHeader bg={ colors.accent.primary } borderBottomWidth='1px' color='white'>
          <Icon as={ FaUser } mr={ 2 } /> My Profile
        </DrawerHeader>
        <DrawerBody>
          {edit ? (
            <EditProfile userData={ userData } onClose={ handleEdit } />
          ) : (
            <>
              <HStack>
                <Avatar
                  size={ 'xl' }
                  src={ userData?.photoUrl || '#' }
                  mb={ 4 }
                  pos={ 'relative' }
                />
                <VStack alignItems={ 'left' }>
                  <Heading fontSize={ '2xl' }>{name}</Heading>
                  <Text fontWeight={ 600 } mb={ 4 }>
                    @{userData?.userName}
                  </Text>
                </VStack>
              </HStack>
              <HStack px={ 3 }>
                <Icon as={ FaEnvelope } color={ colors.accent.primary } />
                <Text>Email: {userData?.email}</Text>
              </HStack>
              <HStack px={ 3 }>
                <Icon as={ FaPhone } color={ colors.accent.primary } />
                <Text>Phone number: {userData?.phoneNumber}</Text>
              </HStack>
              <Button
                mt={ 4 }
                ml={ 3 }
                onClick={ handleEdit }
                color={ 'white' }
                bg={ colors.accent.primary }
              >
                Edit profile
              </Button>


            </>
          )}
        </DrawerBody>
        <Image
          alt='Profile image'
          src={ IMAGES.signUp }
          spacing={ 0 }
          width={ '220px' }
          height={ '220px' }
          m={ 'auto' }
        />
      </DrawerContent>
    </Drawer>
  );
}

export default Profile;

Profile.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};
