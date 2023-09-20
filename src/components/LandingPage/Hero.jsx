import {
  Container,
  Stack,
  Heading,
  Text,
  Button,
  Flex,
  Image,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import IMAGES from '../../assets/images/Images';

function Hero() {
  return (
    <div style={ { background: 'linear-gradient(to bottom, #4E50FB, #150A80)' } }>
      <Container maxW={ '5xl' }>
        <Stack
          textAlign={ 'center' }
          align={ 'center' }
          spacing={ { base: 8, md: 10 } }
          py={ { base: 12, md: 20 } }
        >
          <Heading
            fontWeight={ 600 }
            fontSize={ { base: '3xl', sm: '4xl', md: '6xl' } }
            lineHeight={ '110%' }
            color={ 'white' }
          >
            Event Eaze - Level up your events
          </Heading>
          <Text maxW={ '3xl' } color={ 'white' }>
            Event Eaze is your all-in-one platform for effortless event
            organization. Ready to Simplify Event Planning? Sign Up Now for Free
            and Unlock a World of Seamless Organization and Unforgettable
            Experiences!
          </Text>
          <Stack spacing={ 6 } direction={ 'row' }>
            <Link to={ '/signup ' }>
              <Button
                rounded={ 'md' }
                px={ 6 }
                colorScheme={ '#4E50FB' }
                bg={ 'black' }
                _hover={ { bg: '#150A80' } }
                color={ 'white' }
              >
                Join Now
              </Button>
            </Link>
            <Link to={ '/login' }>
              <Button
                rounded={ 'md' }
                px={ 6 }
                colorScheme={ '#4E50FB' }
                bg={ '#FF4500' }
                _hover={ { bg: '#150A80' } }
                color={ 'white' }
              >
                Log In
              </Button>
            </Link>
          </Stack>
          <Flex w={ 'full' } justifyContent={ 'center' } mb={ '0' }>
            <Image
              src={ IMAGES.hero }
              alt='Illustration'
              height={ { sm: '24rem', lg: '28rem' } }
              mt={ { base: 12, sm: 16 } }
            />
          </Flex>
        </Stack>
      </Container>
    </div>
  );
}

export default Hero;
