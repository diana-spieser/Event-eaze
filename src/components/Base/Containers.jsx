import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
export const Container = ({ children }) => {
  return <Box minH='100vh'>{children}</Box>;
};

export const MainContent = ({ children }) => {
  return (
    <Box ml={ { base: 0, md: 60 } } p='4'>
      {children}
    </Box>
  );
};

export const CardContainer = ({ children }) => {
  return (
    <Box
      boxShadow={ '0px 5px 14px rgba(0, 0, 0, 0.05)' }
      pb='0px'
      overflowY='hidden'
      p={ 4 }
      m={ 4 }
      border={ '0.5px solid' }
      borderRadius={ 'md' }
      borderColor={ 'gray.200' }
    >
      {children}
    </Box>
  );
};


Container.propTypes = {
  children: PropTypes.node.isRequired,
};

MainContent.propTypes = {
  children: PropTypes.node.isRequired,
};

CardContainer.propTypes = {
  children: PropTypes.node,
};
