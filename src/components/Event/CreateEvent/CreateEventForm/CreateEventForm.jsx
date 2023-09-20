import { useContext, useEffect, useState } from 'react';
import { createEvent, getEventCategories } from '../../../../services/event.services';
import { validateEvent, validateTitle, validateDescription } from '../../../../common/constants';
import { Button, FormLabel, FormControl, Input, Textarea, Select, useToast, Box, FormErrorMessage,
  Flex, Center, useColorMode } from '@chakra-ui/react';
import SchedulingOptions from '../SchedulingOptions/SchedulingOptions';
import Address from '../Address/Address';
import UploadEventCover from '../UploadEventCover/UploadEventCover';
import ManageParticipants from '../ManageParticipants/ManageParticipants';
import DatePicker from 'react-datepicker';
import AuthContext from '../../../../context/AuthContext';
import colors from '../../../../theme/colors';
import './CreateEventForm.css';
import PropTypes from 'prop-types';
import 'react-datepicker/dist/react-datepicker.css';

function CreateEventForm(props) {
  const { user, userData } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isPublic, setIsPublic] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [reoccurring, setReoccurring] = useState('never');
  const [selectedImage, setSelectedImage] = useState(null);
  const [participants, setParticipants] = useState({});
  const [isAllDay, setIsAllDay] = useState(false);
  const [reminderDate, setReminderDate] = useState(null);
  const [editors, setEditors] = useState({});
  const { colorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
    getEventCategories()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const categoriesData = snapshot.val();
          setCategories(Object.keys(categoriesData));
        }
      })
      .catch(e => console.error('Error getting categories', e));
  }, []);

  const handleTitleBlur = () => {
    if (validateTitle(title)) {
      setErrors({ ...errors,
        title: validateTitle(title) });
    } else {
      setErrors({ ...errors,
        title: null });
    }
  };

  const handleContentBlur = () => {
    if (validateDescription(description)) {
      setErrors({ ...errors,
        description: validateDescription(description) });
    } else {
      setErrors({ ...errors,
        description: null });
    }
  };

  const handleReminderDateChange = (date) => {
    setReminderDate(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateEvent(title, description, startDate, endDate)) {
      return setErrors(validateEvent(title, description, startDate, endDate));
    }

    props.onClose();

    let participantsByName = {};

    for (const key in participants) {
      if (typeof participants[key] === 'object') {
        participantsByName = { ...participantsByName, ...participants[key] };
        continue;
      }
      participantsByName[key] = true;
    }

    let editorsByName = {};

    for (const key in editors) {
      if(typeof editors[key] ===  'object') {
        editorsByName = { ...editorsByName, ...editors[key] };
        continue;
      }
      editorsByName[key] = true;
    }

    createEvent(title, description, startDate, endDate, address, isPublic, isOnline, user.uid,
      userData.userName, selectedCategory, reoccurring, selectedImage, latitude, longitude,
      participantsByName, userData.photoUrl, reminderDate, editorsByName, isAllDay)
      .then(() => {
        setTitle('');
        setDescription('');
        setReoccurring('never');
        setAddress('');
        setIsPublic(true);
        setIsOnline(false);
        setIsAllDay(false);
        setStartDate(null);
        setEndDate(null);
        setSelectedImage(null);
        setParticipants({});
        setReminderDate(null);
        setErrors({});
        setEditors({});

        toast({
          title: 'Event created successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

      })
      .catch((error) => {
        console.error('Error creating event:', error);
        toast({
          title: 'Error creating event',
          description: 'An error occurred while creating the event.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box m='auto' pb={ 4 } as='form' onSubmit={ handleSubmit }>
      <Flex>
        <FormControl isRequired isInvalid={ errors.title } mr={ 1 }>
          <FormLabel>Title</FormLabel>
          <Input
            type='text'
            placeholder='Enter title'
            value={ title }
            onChange={ (e) => setTitle(e.target.value) }
            onBlur={ handleTitleBlur }
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>
        <FormControl w={ '150px' } ml={ 1 }>
          <FormLabel>Visibility</FormLabel>
          <Select
            value={ isPublic ? 'public' : 'private' }
            onChange={ (e) => setIsPublic(e.target.value === 'public') }
          >
            <option value='private'>Private</option>
            <option value='public'>Public</option>
          </Select>
        </FormControl>
      </Flex>
      <SchedulingOptions
        startDate={ startDate }
        setStartDate={ setStartDate }
        endDate={ endDate }
        setEndDate={ setEndDate }
        setIsAllDay={ setIsAllDay }
        setReoccurring={ setReoccurring }
        errors={ errors }
        reoccurring={ reoccurring }
        isAllDay={ isAllDay }
      />
      <ManageParticipants
        participants={ participants }
        setParticipants={ setParticipants }
        editors={ editors }
        setEditors={ setEditors }
      />
      <Address
        setLongitude={ setLongitude }
        setLatitude={ setLatitude }
        address={ address }
        setAddress={ setAddress }
        isOnline={ isOnline }
        setIsOnline={ setIsOnline }
      />
      <FormControl id='category' isRequired mt='2%'>
        <FormLabel>Category</FormLabel>
        <Select
          placeholder='Select category'
          value={ selectedCategory }
          onChange={ (e) => setSelectedCategory(e.target.value) }
        >
          {categories.map((category) => (
            <option key={ category } value={ category }>
              {category}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl mt={ 2 } mb={ 5 } w={ '49.2%' }>
        <FormLabel>Remind me on</FormLabel>
        <div className={ colorMode === 'light' ? 'light-theme' : 'dark-theme' }>
          <DatePicker
            selected={ reminderDate }
            onChange={ handleReminderDateChange }
            showTimeSelect
            dateFormat='Pp'
            wrapperClassName='date_picker full-width'
            minDate={ new Date() }
            placeholderText='  Select date'
          />
        </div>
      </FormControl>
      <UploadEventCover
        selectedImage={ selectedImage }
        setSelectedImage={ setSelectedImage }
      />
      <FormControl isRequired mt={ 4 } isInvalid={ errors.description }>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder='Enter description'
          value={ description }
          onChange={ (e) => setDescription(e.target.value) }
          onBlur={ handleContentBlur }
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>
      <Center>
        <Button mt={ 4 } bg={ colors.accent.primary } color='white' type='submit'>
          Create Event
        </Button>
      </Center>
    </Box>
  );
}

export default CreateEventForm;

CreateEventForm.propTypes = {
  onClose: PropTypes.func,
};
