import { Box, Flex, Link, Text } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';
import { FaGitlab } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box
      as='footer'
      py='4'
      position='static'
      left='0'
      bottom='0'
      zIndex='100'
      height='60px'
      width='100%'
      mt={ 6 }
    >
      <Flex justifyContent='center' alignItems='center' px='4'>
        <Text marginRight={ '15px' }>
          &copy; {new Date().getFullYear()} Event Eaze
        </Text>
        <Link href='https://gitlab.com/dimodimov/event-eaze' isExternal>
          <Icon
            as={ FaGitlab }
            boxSize={ 4 }
            color={ '#FF4500' }
          />
        </Link>
      </Flex>
    </Box>
  );
};

export default Footer;
