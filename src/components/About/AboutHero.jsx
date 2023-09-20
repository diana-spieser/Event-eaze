import {
  Container,
  Avatar,
  Heading,
  Text,
  VStack,
  Stack,
  Center,
} from '@chakra-ui/react';
import IMAGES from '../../assets/images/Images';


const AboutHero = () => {
  return (
    <Container maxW='7xl' p={ { base: 5, md: 10 } } mx='auto' mt={ '0' } mb={ '0' } pt={ 'O' }>
      <Center>
        <VStack
          spacing={ 4 }
          px={ 2 }

        >
          <Stack justifyContent='center' alignItems='center'>
            <Avatar

              size='2xl'
              src={ IMAGES.logo }
            />
          </Stack>
          <Heading
            textAlign='center'
            margin='0 auto'
            width={ { base: '23rem', sm: 'auto' } }
            fontSize={ { base: '2.5rem', sm: '3rem' } }
          >
            About Us
          </Heading>
          <Text textAlign='center'>
            We are team One. We have created this app to help you manage your events with ease.
          </Text>
        </VStack>
      </Center>
    </Container>
  );
};


export default AboutHero;
