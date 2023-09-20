import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Stack,
  useColorMode,
  VStack,
  Text,
  HStack,
  Image,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, BellIcon } from '@chakra-ui/icons';

import { FiChevronDown } from 'react-icons/fi';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { logoutUser } from '../../services/auth.service';
import IMAGES from '../../assets/images/Images';
import AuthContext from '../../context/AuthContext';
import colors from '../../theme/colors';

export default function LandingPageNavBar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, userData } = useContext(AuthContext);

  const backgroundColor = colors[colorMode].bg.primary;

  return (
    <>
      <Box bg={ backgroundColor } px={ 4 } position={ 'sticky' } top={ 0 } zIndex={ 100 }>
        <Flex h={ 16 } alignItems={ 'center' } justifyContent={ 'space-between' }>
          <Flex alignItems='center'>
            <Link to='/'>
              <Image
                src={ IMAGES.logo }
                alt='Logo'
                height={ '40px' }
                max-width={ '155px' }
              />
            </Link>
            <Text
              cursor={ 'pointer' }
              fontSize='lg'
              fontFamily='monospace'
              fontWeight='bold'
              ml='2'
            >
              <Link to={ '/' }>EventEaze</Link>
            </Text>
          </Flex>

          <Flex alignItems={ 'center' }>
            <Stack direction={ 'row' } spacing={ 7 }>
              <HStack>
                <Button variant={ 'ghost' } onClick={ toggleColorMode }>
                  {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                </Button>
                {userData && (
                  <Button variant={ 'ghost' }>
                    <BellIcon />
                  </Button>
                )}
              </HStack>
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
                    <MenuItem>Profile</MenuItem>
                  ) : (
                    <Link to='/login'>
                      <MenuItem>Log in</MenuItem>
                    </Link>
                  )}
                  {user !== null ? (
                    <MenuItem to={ '/' } onClick={ logoutUser }>
                      Log out
                    </MenuItem>
                  ) : (
                    <Link to='/signup'>
                      <MenuItem>Sign Up</MenuItem>
                    </Link>
                  )}
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
