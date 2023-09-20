import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  HStack,
  Avatar,
  Text,
  InputGroup,
  InputRightElement,
  Alert,
  AlertDescription,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { validateEditProfile, validateAvatar } from '../../common/constants';
import { getAllUsers, updateUserData } from '../../services/user.service';
import { PHONE_TAKEN_ERROR, EMAIL_USED_ERROR } from '../../common/constants';
import { storage } from '../../config/firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Authentication from './Autenthnicate';
import colors from '../../theme/colors';
import PropTypes from 'prop-types';

function EditProfile({ userData, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState();
  const [previewAvatar, setPreviewAvatar] = useState();
  const [passFormData, setPassFormData] = useState({});
  const [showAuth, setShowAuth] = useState(false);
  const { register, handleSubmit } = useForm();

  const handleShowPassword = () => setShowPassword(!showPassword);
  const handleShowPasswordRepeat = () =>
    setShowPasswordRepeat(!showPasswordRepeat);

  useEffect(() => {
    if (!selectedFile) {
      return setPreviewAvatar(undefined);
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewAvatar(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPreviewAvatar(undefined);
      return setSelectedFile(undefined);
    }

    if (validateAvatar(e.target.files[0])) {
      return setErrors(validateAvatar(e.target.files[0]));
    }

    setSelectedFile(e.target.files[0]);
    setErrors({});
  };

  const onSubmit = (formData) => {
    if (validateEditProfile(formData)) {
      return setErrors(validateEditProfile(formData));
    }

    if (selectedFile) {
      const imageRef = ref(storage, `images/${selectedFile.name}`);
      uploadBytes(imageRef, selectedFile)
        .then(() => getDownloadURL(imageRef))
        .then((imageUrl) => {
          updateUserData(
            userData?.userName.toLowerCase(),
            'photoUrl',
            imageUrl
          );
        })
        .catch((error) => setErrors({ e: error.message }));
    }

    getAllUsers()
      .then((snapshot) => {
        if (snapshot.exists()) {
          if (formData.phoneNumber !== '') {
            if (
              Object.values(snapshot.val()).find(
                (el) => el.phoneNumber === formData.phoneNumber
              )
            ) {
              throw new Error(PHONE_TAKEN_ERROR);
            }
          }
          if (formData.email !== '') {
            if (
              Object.values(snapshot.val()).find(
                (el) => el.email.toLowerCase() === formData.email.toLowerCase()
              )
            ) {
              throw new Error(EMAIL_USED_ERROR);
            }
          }
        }

        if (formData.email !== '' || formData.password !== '') {
          setPassFormData(formData);
          setShowAuth(true);
        } else {
          const updatePromises = [];

          for (const [key, value] of Object.entries(formData)) {
            if (
              key === 'email' ||
              key === 'password' ||
              key === 'passwordRepeat' ||
              value === ''
            )
              continue;
            updatePromises.push(
              updateUserData(userData?.userName.toLowerCase(), key, value)
            );
          }

          Promise.all(updatePromises);
          onClose();
          return setShowAuth(false);
        }
      })
      .catch((e) => setErrors({ e: e.message }));
  };

  return (
    <>
      {showAuth ? (
        <Authentication
          userData={ userData }
          passFormData={ passFormData }
          setShowAuth={ setShowAuth }
          onClose={ onClose }
        />
      ) : (
        <form onSubmit={ handleSubmit(onSubmit) }>
          <FormControl onChange={ onSelectFile }>
            <Stack direction={ ['column', 'row'] } spacing={ 5 }>
              <Avatar size='xl' src={ previewAvatar || userData?.photoUrl } />
              <Stack>
                <Text fontSize='18px' fontWeight={ 600 }>
                  @{userData?.userName}
                </Text>
                <FormLabel htmlFor='avatar'>
                  <Button as='span' color={ 'white' } bg={ colors.accent.primary }>
                    Upload Photo
                  </Button>
                </FormLabel>
                <Input display='none' type='file' id='avatar' />
              </Stack>
            </Stack>
          </FormControl>
          <HStack mt={ 2 }>
            <FormControl isInvalid={ errors.firstName }>
              <FormLabel>First Name</FormLabel>
              <Input
                type='text'
                name='firstName'
                placeholder={ userData?.firstName }
                { ...register('firstName') }
              />
            </FormControl>
            <FormControl isInvalid={ errors.lastName }>
              <FormLabel>Last Name</FormLabel>
              <Input
                type='text'
                name='lastName'
                placeholder={ userData?.lastName }
                { ...register('lastName') }
              />
            </FormControl>
          </HStack>
          <FormControl>
            <FormLabel mt={ 1 }>Email address</FormLabel>
            <Input
              placeholder={ userData?.email }
              { ...register('email') }
              type='email'
              name='email'
            />
          </FormControl>
          <FormControl isInvalid={ errors.phoneNumber }>
            <FormLabel mt={ 1 }>Phone Number</FormLabel>
            <Input
              type='tel'
              name='phoneNumber'
              placeholder={ userData?.phoneNumber }
              { ...register('phoneNumber') }
            />
          </FormControl>
          <FormControl isInvalid={ errors.password }>
            <FormLabel mt={ 1 }>Password</FormLabel>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={ showPassword ? 'text' : 'password' }
                name='password'
                placeholder='Password'
                { ...register('password') }
              />
              <InputRightElement h={ 'full' }>
                <Button variant={ 'ghost' } onClick={ handleShowPassword }>
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormLabel mt={ 1 }>Repeat Password</FormLabel>
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={ showPasswordRepeat ? 'text' : 'password' }
                name='passwordRepeat'
                placeholder='Repeat Password'
                { ...register('passwordRepeat') }
              />
              <InputRightElement h={ 'full' }>
                <Button variant={ 'ghost' } onClick={ handleShowPasswordRepeat }>
                  {showPasswordRepeat ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={ 2 } mt={ 3 } mb={ 3 } direction={ ['column', 'row'] }>
            <Button onClick={ onClose }>Cancel</Button>
            <Button type='submit' color={ 'white' } bg={ colors.accent.primary }>
              Update
            </Button>
          </Stack>
          <Text fontSize={ 12 } mb={ 1 }>
            * Blank fields will not be updated.
          </Text>
          {Object.keys(errors).length > 0 && (
            <Alert status='error'>
              <AlertDescription>
                {Object.values(errors).map((err, i) => (
                  <Text key={ i } mb={ 1 }>
                    {err}
                  </Text>
                ))}
              </AlertDescription>
            </Alert>
          )}
        </form>
      )}
    </>
  );
}

export default EditProfile;

EditProfile.propTypes = {
  userData: PropTypes.shape({
    userName: PropTypes.string,
    photoUrl: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
};
