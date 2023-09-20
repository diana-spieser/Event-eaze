import { format } from 'date-fns';
import { Avatar, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function NotificationContent({ author, avatar, title, date }) {
  const navbarIcon = useColorModeValue('gray.500', 'white.200');
  const notificationColor = useColorModeValue('gray.700', 'white');

  return (
    <>
      <Avatar
        src={ avatar || '#' }
        borderRadius='full'
        me='16px'
      />
      <Flex flexDirection='column'>
        <Text fontWeight='bold' fontSize='14px' as='span'>
          {author}
        </Text>
        <Text           
          fontSize='14px'
          mb='5px'
          color={ notificationColor }
          maxWidth='220px'
          whiteSpace='normal'
          overflow='hidden'
          textOverflow='ellipsis'
        >
          Invited you to join &quot;{title}&quot;
        </Text>
        <Flex alignItems='center'>
          <Text fontSize='xs' lineHeight='100%' color={ navbarIcon }>
            {format(new Date(date), 'MMM dd, yyyy')}
          </Text>
        </Flex>
      </Flex>
    </>
  );
}

export default NotificationContent;

NotificationContent.propTypes = {
  author: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
