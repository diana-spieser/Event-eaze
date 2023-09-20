
import { Stack, Flex, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const EventDetails = ({ text, icon, iconBg }) => {
  return (
    <Stack direction={ 'row' } align={ 'center' }>
      <Flex
        w={ 8 }
        h={ 8 }
        align={ 'center' }
        justify={ 'center' }
        rounded={ 'full' }
        bg={ iconBg }
      >
        {icon}
      </Flex>
      <Text fontWeight={ 600 }>{text}</Text>
    </Stack>
  );
};
export default EventDetails;

EventDetails.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.element,
  iconBg: PropTypes.string,
};
