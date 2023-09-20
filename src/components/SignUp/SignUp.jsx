import { useState, useContext } from 'react';
import { registerUser } from '../../services/auth.service';
import { createUserHandle, getAllUsers } from '../../services/user.service';
import { Link, useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { validateSignUp, PHONE_TAKEN_ERROR, USERNAME_TAKEN_ERROR } from '../../common/constants';
import {
  Image, FormControl, FormLabel, Input, Stack, Button, Heading, InputGroup,
  InputRightElement, Text, HStack, Flex, Alert, AlertIcon, AlertDescription,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import AuthContext from '../../context/AuthContext';
import IMAGES from '../../assets/images/Images';

function Register() {
  const { register, handleSubmit } = useForm();
  const [errors, setErrors] = useState({});
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowPasswordRepeat = () => setShowPasswordRepeat(!showPasswordRepeat);

  const onSubmit = (formData) => {
    if(validateSignUp(formData)) {
      return setErrors(validateSignUp(formData));
    }

    getAllUsers()
      .then(snapshot => {
        if(snapshot.exists()) {
          if(Object.values(snapshot.val()).find(el => el.phoneNumber === formData.phoneNumber)){
            throw new Error(PHONE_TAKEN_ERROR);
          }

          if (Object.keys(snapshot.val()).includes(formData.userName.toLowerCase())) {
            throw new Error(USERNAME_TAKEN_ERROR);
          }
        }

        return registerUser(formData.email, formData.password);
      })
      .then(credential => {
        return createUserHandle(formData.userName.toLowerCase(), credential.user.uid, credential.user.email,
          formData.firstName, formData.lastName, formData.phoneNumber, formData.userName)
          .then(() => {
            setUser({
              user: credential.user
            });
          });
      })
      .then(() => {
        navigate('/dashboard');
      }).catch(e => setErrors({ e: e.message }));
    setErrors({});
  };

  return (
    <Stack minH='92vh' direction={ { base: 'column-reverse', md: 'row' } }>
      <Flex flex={ 1 }>
        <Image
          alt='Cover image'
          objectFit='cover'
          src={ IMAGES.signUp }
          spacing={ 0 }
        />
      </Flex>
      <Flex p={ 8 } flex={ 1 } align='center' justify='center'>
        <Stack spacing={ 4 } width={ '80%' }>
          <Heading mb={ 4 } textAlign={ 'center' }>
            Sign Up
          </Heading>
          <form onSubmit={ handleSubmit(onSubmit) }>
            <Stack spacing={ 2 }>
              <FormControl isRequired isInvalid={ !!errors.userName }>
                <FormLabel>Username</FormLabel>
                <Input type='text' name='userName' { ...register('userName') } />
              </FormControl>
              <HStack>
                <FormControl isRequired isInvalid={ !!errors.firstName }>
                  <FormLabel>First Name</FormLabel>
                  <Input
                    type='text'
                    name='firstName'
                    { ...register('firstName') }
                  />
                </FormControl>
                <FormControl isRequired isInvalid={ !!errors.lastName }>
                  <FormLabel>Last Name</FormLabel>
                  <Input
                    type='text'
                    name='lastName'
                    { ...register('lastName') }
                  />
                </FormControl>
              </HStack>
              <FormControl isRequired>
                <FormLabel>Email address</FormLabel>
                <Input type='email' name='email' { ...register('email') } />
              </FormControl>
              <FormControl isRequired isInvalid={ !!errors.phoneNumber }>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type='tel'
                  name='phoneNumber'
                  { ...register('phoneNumber') }
                />
              </FormControl>
              <FormControl isRequired isInvalid={ !!errors.password }>
                <FormLabel>Password</FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={ showPassword ? 'text' : 'password' }
                    name='password'
                    { ...register('password') }
                  />
                  <InputRightElement h={ 'full' }>
                    <Button variant={ 'ghost' } onClick={ handleShowPassword }>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormLabel>Repeat Password</FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={ showPasswordRepeat ? 'text' : 'password' }
                    name='passwordRepeat'
                    { ...register('passwordRepeat') }
                  />
                  <InputRightElement h={ 'full' }>
                    <Button
                      variant={ 'ghost' }
                      onClick={ handleShowPasswordRepeat }
                    >
                      {showPasswordRepeat ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button type='submit'>Sign Up</Button>
            </Stack>
            <Stack pt={ 6 }>
              {Object.keys(errors).length > 0 && (
                <Alert status='error'>
                  <AlertIcon />
                  <AlertDescription>
                    {Object.values(errors).map((err, i) => (
                      <Text key={ i } mb={ 1 }>
                        {err}
                      </Text>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
              <Text align={ 'center' }>
                {' '}
                Already a member?
                <Link to={ '/login' }> Login</Link>
              </Text>
            </Stack>
          </form>
        </Stack>
      </Flex>
    </Stack>
  );
}

export default Register;
