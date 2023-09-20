import { useState, useEffect } from 'react';
import { Button, FormControl, FormLabel, Input, InputGroup, Text,
  InputRightElement, Alert, AlertIcon, AlertDescription, Box } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { useForm } from 'react-hook-form';
import { updateUserData } from '../../services/user.service';
import { updatePassword, updateEmail } from 'firebase/auth';
import PropTypes from 'prop-types';

const Authentication = ({ userData, passFormData, setShowAuth, onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();
  const [success, setSuccess] = useState(false);

  const handleClick = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        setSuccess(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [success]);

  const onSubmit = (data) => {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      data.password,
    );

    reauthenticateWithCredential(auth.currentUser, credential).then(() => {   
      const updatePromises = [];    

      for (const [key, value] of Object.entries(passFormData)) {
        if (key === 'passwordRepeat' || value === '') continue;

        if (key !== 'password' && key !== 'email') {
          updatePromises.push(updateUserData(userData?.userName.toLowerCase(), key, value));
        }

        if (key === 'password') {
          updatePromises.push(updatePassword(auth.currentUser, passFormData.password));
        }

        if (key === 'email') {
          updatePromises.push(updateEmail(auth.currentUser, passFormData.email));
          updatePromises.push(updateUserData(userData?.userName.toLowerCase(), key, value));
        }
      }

      Promise.all(updatePromises);

      setError('');

      setSuccess(true);

      setTimeout(() => {
        setShowAuth(false);
        onClose();   
      }, 1500);   
    })
      .catch(e => setError(e.message));

  };

  if (success) {
    return (
      <Box textAlign='center'>
        <Alert status='success' mt={ 4 }>
          <AlertIcon />
          Update Successful!
        </Alert>
      </Box>
    );
  }

  return (
    <form onSubmit={ handleSubmit(onSubmit) }>
      <Text>Authentication is required in order to change your email or password!</Text>  
      <FormControl mt={ 4 } isRequired>
        <FormLabel>Current Password</FormLabel>
        <InputGroup>
          <Input
            type={ showPassword ? 'text' : 'password' }
            name='password'
            focusBorderColor='lightblue'
            { ...register('password') }
          />
          <InputRightElement h={ 'full' }>
            <Button variant={ 'ghost' } colorScheme='grey' onClick={ handleClick }>
              {showPassword ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button type='submit' mt={ 4 } mb={ 4 } w={ 'full' }>
        Authenticate
      </Button>
      {error && <Alert status='error' mb={ 3 }>
        <AlertIcon />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>}
    </form>
  );
};

export default Authentication;

Authentication.propTypes = {
  userData: PropTypes.shape({
    userName: PropTypes.string,
  }),
  passFormData: PropTypes.shape({
    userName: PropTypes.string,
    photoUrl: PropTypes.string,
    password: PropTypes.string,
    email: PropTypes.string,
  }),
  setShowAuth: PropTypes.func,
  onClose: PropTypes.func,
};