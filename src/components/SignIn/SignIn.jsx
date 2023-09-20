import { useState, useContext } from 'react';
import { loginUser } from '../../services/auth.service';
import { Link, useNavigate } from 'react-router-dom';
import { Heading, Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Flex, Stack, Text, Alert,
  AlertIcon, AlertDescription, Image, VStack, } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { getUserByEmail } from '../../services/user.service';
import AuthContext from '../../context/AuthContext';
import IMAGES from '../../assets/images/Images';

function SignIn() {
  const [show, setShow] = useState(false);
  const { setUser } = useContext(AuthContext);


  const navigate = useNavigate();
  const [errors, setErrors] = useState('');

  const {
    handleSubmit,
    register,
    formState: { errors: formErrors },
    reset,
  } = useForm();

  const handleClick = () => setShow(!show);

  const onSubmit = (data) => {
    const { email, password } = data;

    getUserByEmail(email)
      .then(snapshot => {
        if (snapshot.exists()) {
          const isBlocked = Object.values(snapshot.val())[0].isBlocked;
          if (isBlocked) {
            throw new Error ('You are blocked'); 
          }
        }

        return loginUser(email, password);   
      })
      .then((credential) => {
        setUser({
          user: credential.user,
        });

        reset({
          email: '',
          password: '',
        });

        navigate('/');
      })
      .catch((e) => setErrors(e.message));     
  };

  return (
    <Stack minH='92vh' direction={ { base: 'column-reverse', md: 'row' } }>
      <Flex flex={ 1 }>
        <Image
          alt='Cover image'
          objectFit='cover'
          src={ IMAGES.signIn }
          spacing={ 0 }
        />
      </Flex>
      <Flex p={ 8 } flex={ 1 } align='center' justify='center'>
        <Stack spacing={ 4 } width={ '80%' }>
          <Heading mb={ 4 } textAlign={ 'center' }>
            Login
          </Heading>
          <VStack as='form' onSubmit={ handleSubmit(onSubmit) }>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type='email'
                name='email'
                focusBorderColor='lightblue'
                { ...register('email', { required: true }) }
              />
            </FormControl>
            {formErrors.email && (
              <Alert status='error'>
                <AlertIcon />
                <AlertDescription>Email is required.</AlertDescription>
              </Alert>
            )}
            <FormControl mt={ 4 } isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={ show ? 'text' : 'password' }
                  name='password'
                  focusBorderColor='lightblue'
                  { ...register('password', { required: true }) }
                />
                <InputRightElement h={ 'full' }>
                  <Button h='1.75rem' size='sm' onClick={ handleClick }>
                    {show ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            {formErrors.password && (
              <Alert status='error'>
                <AlertIcon />
                <AlertDescription>Password is required.</AlertDescription>
              </Alert>
            )}
            <Button type='submit' mt={ 4 } mb={ 4 } w={ 'full' }>
              Login
            </Button>
            {errors && (
              <Alert status='error'>
                <AlertIcon />
                <AlertDescription>{errors}</AlertDescription>
              </Alert>
            )}
          </VStack>
          <Stack>
            <Text align={ 'center' } mt={ 2 }>
              Don&apos;t have an account?{' '}
              <Link to={ '/signup' }> Register Here</Link>
            </Text>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}

export default SignIn;
