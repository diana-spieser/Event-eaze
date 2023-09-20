
import { Link, useLocation } from 'react-router-dom';
import { Box, Flex, Icon } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function NavItem({ icon, children, link, ...rest }) {
  const location = useLocation();
  const isActive = location.pathname === link;


  return (
    <Box
      as={ Link }
      to={ link }
      style={ { textDecoration: 'none' } }
      _focus={ { boxShadow: 'none' } }
    >
      <Flex
        align='center'
        p='4'
        mx='4'
        borderRadius='lg'
        role='group'
        cursor='pointer'
        fontWeight={ 'bold' }
        bg={ isActive ? 'accent.primary' : 'transparent' }
        color={ isActive ? 'white' : 'default' }
        _hover={ {
          transform: 'scale(1.05)',
          transition: 'transform 0.2s ease',
          color: isActive ? 'none' : 'accent.primary',
        } }
        { ...rest }
      >
        {icon && (
          <Icon
            mr='4'
            fontSize='16'
            _groupHover={ {
              color: isActive ? 'none' : 'accent.primary',
            } }
            as={ icon }
          />
        )}
        {children}
      </Flex>
    </Box>
  );
}

NavItem.propTypes = {
  icon: PropTypes.func,
  children: PropTypes.string,
  link: PropTypes.string,
};

export default NavItem;
