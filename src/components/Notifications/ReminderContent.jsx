import { format } from 'date-fns';
import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function ReminderContent({ title, description, reminderOn }) {
  const navbarIcon = useColorModeValue('gray.500', 'white.200');
  const notificationColor = useColorModeValue('gray.700', 'white');
  const heading = title.length > 50 ? title.substring(0, 50) + '...' : title;
  const reminder = description.length > 65 ? description.substring(0, 65) + '...' : description;

  return (
    <Flex flexDirection='column'>
      <Text fontWeight='bold' 
        fontSize='14px' 
        as='span'  
        maxWidth='220px'
        whiteSpace='normal'
        overflow='hidden'
        textOverflow='ellipsis'>
        Reminder: {heading}
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
        {reminder}
      </Text>
      <Flex alignItems='center'>
        <Text fontSize='xs' lineHeight='100%' color={ navbarIcon }>
          {format(new Date(reminderOn), 'MMM dd, yyyy HH:mm')}
        </Text>
      </Flex>
    </Flex>
  );
}

export default ReminderContent;

ReminderContent.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  reminderOn: PropTypes.string.isRequired,
};
