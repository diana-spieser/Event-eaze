
import { Link } from 'react-router-dom';
import { Box, Flex, Text, CloseButton, useColorModeValue } from '@chakra-ui/react';
import {
  AiOutlineDashboard,
  AiOutlineCalendar,
  AiOutlineContacts,
  AiOutlineInfoCircle,
  AiOutlineSound } from 'react-icons/ai';
import { Image } from '@chakra-ui/react';
import IMAGES from '../../assets/images/Images';
import NavItem from './NavItem';
import PropTypes from 'prop-types';

export const LinkItems = [
  { name: 'Dashboard', icon: AiOutlineDashboard, link: '/dashboard' },
  { name: 'Calendar', icon: AiOutlineCalendar, link: '/calendar' },
  { name: 'Events', icon: AiOutlineSound, link: '/events' },
  { name: 'Contacts', icon: AiOutlineContacts, link: '/contacts' },
  { name: 'About', icon: AiOutlineInfoCircle, link: '/about' },
];

function SidebarContent({ onClose, ...rest }) {
  return (
    <Box
      transition='3s ease'
      bg={ useColorModeValue('white', 'gray.900') }
      borderRight='1px'
      borderRightColor={ useColorModeValue('gray.200', 'gray.700') }
      w={ { base: 'full', md: 60 } }
      pos='fixed'
      h='full'
      { ...rest }
    >
      <Flex h='20' alignItems='center' mx='8' justifyContent='space-between'>
        <Flex alignItems='center'>
          <Link to={ '/dashboard' }>
            <Image src={ IMAGES.logo } height='53px' alt='logo' />
          </Link>
          <Text
            cursor={ 'pointer' }
            fontSize='lg'
            fontFamily='monospace'
            fontWeight='bold'
            ml='2'
          >
            <Link to={ '/dashboard' }>EventEaze</Link>
          </Text>
        </Flex>
        <CloseButton display={ { base: 'flex', md: 'none' } } onClick={ onClose } />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={ link.name }
          onClick={ onClose }
          icon={ link.icon }
          link={ link.link }
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
}

SidebarContent.propTypes = {
  onClose: PropTypes.func,
};

export default SidebarContent;
