import {
  IconButton,
  Avatar,
  Box,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  useColorMode,

} from '@chakra-ui/react';
import { FiMenu, FiChevronDown } from 'react-icons/fi';
import { MoonIcon, SunIcon, BellIcon, AddIcon } from '@chakra-ui/icons';
import { logoutUser } from '../../services/auth.service';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Profile from '../Profile/Profile';
import AuthContext from '../../context/AuthContext';
import CreateEventModal from '../Event/CreateEvent/CreateEventModal/CreateEventModal';
import NotificationWindow from '../Notifications/NotificationWindow';
import PropTypes from 'prop-types';




function Navbar({ onOpen, ...rest }) {
  const { user, userData } = useContext(AuthContext);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreteEventSuccess = () => {
    closeModal();
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Flex
      ml={ { base: 0, md: 60 } }
      px={ { base: 4, md: 4 } }
      alignItems='center'
      bg={ useColorModeValue('white', 'gray.900') }
      borderBottomWidth='1px'
      borderBottomColor={ useColorModeValue('gray.200', 'gray.700') }
      justifyContent={ { base: 'space-between', md: 'flex-end' } }
      { ...rest }
    >
      <IconButton
        display={ { base: 'flex', md: 'none' } }
        onClick={ onOpen }
        variant='outline'
        aria-label='open menu'
        icon={ <FiMenu /> }
      />

      <HStack spacing={ { base: '0', md: '2' } }>
        {userData && (
          <>
            <Button variant={ 'ghost' } onClick={ openModal }>
              <AddIcon />
            </Button>
            <CreateEventModal isOpen={ isModalOpen } onClose={ closeModal }
              onEventCreated={ handleCreteEventSuccess } />
          </>
        )}

        <Button variant={ 'ghost' } onClick={ toggleColorMode }>
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>

        {/* Notifications */}
        {userData && (
          <Menu>
            <MenuButton
              as={ IconButton }
              variant='ghost'
              aria-label='Notifications'
            ><BellIcon />
              {notificationCount > 0 && (<Box
                pos='absolute'
                top='33px'
                right='31px'
                p='4px'
                fontSize='xs'
                fontWeight='bold'
                lineHeight='none'
                color='red.100'
                transform='translate(50%,-50%)'
                bg='red'
                rounded='full'
              >
                {notificationCount}
              </Box>)}

            </MenuButton>

            <NotificationWindow setNotificationCount={ setNotificationCount }/>

          </Menu>
        )}

        <Flex alignItems={ 'center' }>
          <Menu>
            <MenuButton
              py={ 2 }
              transition='all 0.3s'
              _focus={ { boxShadow: 'none' } }
            >
              {userData ? (
                <HStack>
                  <Avatar size={ 'sm' } src={ `${userData.photoUrl}` } />
                  <VStack
                    display={ { base: 'none', md: 'flex' } }
                    alignItems='flex-start'
                    spacing='1px'
                    ml='2'
                  >
                    <Text fontSize='sm'>{userData.userName}</Text>
                    <Text fontSize='xs' color='gray.600'>
                      {userData.role}
                    </Text>
                  </VStack>
                  <Box display={ { base: 'none', md: 'flex' } }>
                    <FiChevronDown />
                  </Box>
                </HStack>
              ) : (
                <Avatar size={ 'sm' } src={ '' } />
              )}
            </MenuButton>
            <MenuList
              bg={ useColorModeValue('white', 'gray.900') }
              borderColor={ useColorModeValue('gray.200', 'gray.700') }
            >
              {user !== null ? (
                <>
                  <MenuItem onClick={ handleOpenDrawer }>Profile</MenuItem>
                  <Profile isOpen={ isDrawerOpen } onClose={ handleCloseDrawer } />
                </>
              ) : (
                <Link to='/login'>
                  <MenuItem>Log in</MenuItem>
                </Link>
              )}
              {user !== null ? (
                <MenuItem onClick={ handleLogout }> Log out</MenuItem>
              ) : (
                <Link to='/signup'>
                  <MenuItem>Sign Up</MenuItem>
                </Link>
              )}
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
}

Navbar.propTypes = {
  onOpen: PropTypes.func,
};

export default Navbar;
