import {
  Stack,
  Heading,
  Text,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
} from '@chakra-ui/react';
import colors from '../../../theme/colors';
import PropTypes from 'prop-types';

const Participants = ({ participants }) => {
  const avatarSize = useBreakpointValue({ base: 'md', md: 'lg' });

  return (
    <Stack mt={ 4 }>
      <Heading
        lineHeight={ 1.1 }
        fontSize={ { base: 'lg', sm: 'sm', md: 'lg', lg: 'xl' } }
      >
        Participants ({participants.length})
      </Heading>
      <Stack direction={ 'row' } spacing={ 4 } align={ 'center' }>

        <AvatarGroup max={ 6 }>
          {participants.slice(0, 6).map((participant) => (
            <Avatar
              key={ participant.userName }
              src={ participant.photoUrl }
              size={ avatarSize }
              position={ 'relative' }
              zIndex={ 2 }
              _before={ {
                content: '""',
                width: 'full',
                height: 'full',
                rounded: 'full',
                transform: 'scale(1.125)',
                bg: colors.accent.primary,
                position: 'absolute',
                zIndex: -1,
                top: 0,
                left: 0,
              } }
            >
              {!participant.photoUrl ? (
                <Text
                  fontSize='md'
                  fontWeight='bold'
                  color='white'
                  textTransform='uppercase'
                >
                  {getInitials(participant.userName)}
                </Text>
              ) : null}
            </Avatar>
          ))}
        </AvatarGroup>
      </Stack>
    </Stack>
  );
};

function getInitials(name) {
  const names = name.split(' ');
  const initials = names.map((n) => n.slice(0, 2).toUpperCase()).join('');
  return initials.slice(0, 2);
}

export default Participants;

Participants.propTypes = {
  participants: PropTypes.array,
};
