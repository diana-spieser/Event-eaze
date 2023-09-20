import {
  Container,
  Text,
  VStack,
  Box,
  Avatar,
  Icon,
  useColorModeValue,
  IconButton,
  Divider,
  Flex,
  Link,
  useColorMode
} from '@chakra-ui/react';
import { FaQuoteRight } from 'react-icons/fa';
import colors from '../../theme/colors';
import PropTypes from 'prop-types';


const AboutTeamMemberCard = ({ member }) => {
  const { colorMode } = useColorMode();
  return (
    <Container maxW='5xl' p={ { base: 5, md: 10 } } pt={ '0' }>
      <VStack
        spacing={ 3 }
        p={ { base: 4, sm: 8 } }
        bg={ useColorModeValue('white', 'blackAlpha.600') }
        borderTop='2px solid'
        borderColor={ colors.accent.primary }
        borderBottomLeftRadius='lg'
        borderBottomRightRadius='lg'
        maxW='25rem'
        margin='0 auto'
        boxShadow='lg'
      >
        <Icon as={ FaQuoteRight } w={ 8 } h={ 8 } color='green.400' />
        <Text p={ 5 } color={ colorMode === 'dark' ? 'white' : 'black' }>
          {member.content}
        </Text>
        <VStack alignItems='center'>
          <Avatar
            name='avatar'
            src={ member.imageSrc }
            size='2xl'

          />
          <Box textAlign='center'>
            <Text fontWeight='bold' fontSize='lg'>
              {member.name}
            </Text>
            <Text fontSize='md' color='gray.500'>
              {member.position}
            </Text>
          </Box>
          <Divider />
          <Flex alignItems='center' justify='center' w='100%'>
            <Box textAlign='center'>
              {member.accounts.map((sc, index) => (
                <IconButton
                  key={ index }
                  as={ Link }
                  isExternal
                  href={ sc.url }
                  aria-label={ sc.label }
                  colorScheme={ sc.type }
                  rounded='full'
                  icon={ sc.icon }
                />
              ))}
            </Box>
          </Flex>
        </VStack>
      </VStack>
    </Container>
  );
};

export default AboutTeamMemberCard;

AboutTeamMemberCard.propTypes = {
  member: PropTypes.object,
};
