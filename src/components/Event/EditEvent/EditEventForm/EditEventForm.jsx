import { useEffect, useState, useContext } from 'react';
import { getEventCategories, updateEvent } from '../../../../services/event.services';
import { validateEvent, validateTitle, validateDescription } from '../../../../common/constants';
import { getReminderByEventId } from '../../../../services/reminder.service';
import { Button, FormLabel, FormControl, Input, Textarea, Select, useToast, Box, FormErrorMessage, 
  Flex, Center, useColorMode } from '@chakra-ui/react';
import SchedulingOptions from '../../CreateEvent/SchedulingOptions/SchedulingOptions';
import ManageParticipants from '../../CreateEvent/ManageParticipants/ManageParticipants';
import Address from '../../CreateEvent/Address/Address';
import EditEventCover from '../EditEventCover/EditEventCover';
import AuthContext from '../../../../context/AuthContext';
import DatePicker from 'react-datepicker';
import colors from '../../../../theme/colors';
import './EditEventForm.css';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';

const EditEventForm = (props) => {
  const { userData } = useContext(AuthContext);
  const [title, setTitle] = useState(props.event.title);
  const [description, setDescription] = useState(props.event.description);
  const [startDate, setStartDate] = useState(props.event.startDate);
  const [endDate, setEndDate] = useState(props.event.endDate);
  const [address, setAddress] = useState(props.event.address);
  const [latitude, setLatitude] = useState(props.event.latitude);
  const [longitude, setLongitude] = useState(props.event.longitude);
  const [selectedCategory, setSelectedCategory] = useState(props.event.categoryId);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isPublic, setIsPublic] = useState(props.event.isPublic);
  const [isOnline, setIsOnline] = useState(props.event.isOnline);
  const [reoccurring, setReoccurring] = useState(props.event.reoccurring);
  const [selectedImage, setSelectedImage] = useState(null);
  const [participants, setParticipants] = useState(props.event.participants || {});
  const [editors, setEditors] = useState(props.event.editors || {});
  const [isAllDay, setIsAllDay] = useState(props.event.isAllDay);
  // eslint-disable-next-line no-unused-vars
  const [photoUrl, setPhotoUrl] = useState(props.event.photoUrl || '');
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderId, setReminderId] = useState(null);
  const { colorMode } = useColorMode();
  const toast = useToast();
  const eventId = props.event.id;
  
  useEffect(() => {
    getEventCategories()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const categoriesData = snapshot.val();
          setCategories(Object.keys(categoriesData));
        }
      })
      .catch((e) => console.error('Error getting categories', e));
  }, []);

  useEffect(() => {
    getReminderByEventId(eventId)
      .then(snapshot => {
        if (snapshot.exists()) {
          const currentUser = userData?.userName.toLowerCase();
          const reminder = Object.values(snapshot.val())
            .filter(reminder => reminder.userName === currentUser);
          const reminderOn = reminder.length > 0 ? new Date(reminder[0].reminderOn) : null;
          const id = reminder.length > 0 ? reminder[0].reminderId : null;
          
          setReminderId(id);
          setReminderDate(reminderOn);
        }
      });
  }, []);
    
  const handleTitleBlur = () => {
    if (validateTitle(title)) {
      setErrors({ ...errors, title: validateTitle(title) });
    } else {
      setErrors({ ...errors, title: null });
    }
  };

  const handleContentBlur = () => {
    if (validateDescription(description)) {
      setErrors({ ...errors, description: validateTitle(description) });
    } else {
      setErrors({ ...errors, description: null });
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

    let participantsByName = {};
    const initialParticipants = props.event.participants || {};
    const newlyAddedParticipants = {};
    
    for (const key in participants) {
      if (typeof participants[key] === 'object') {
        participantsByName = { ...participantsByName, ...participants[key] };
        continue;
      }
      
      participantsByName[key] = true;
    }
    
    for (const key in participantsByName) {
      if (!initialParticipants[key]) {
        newlyAddedParticipants[key] = true;
      }
    }

    const removedParticipants = {};

    for (const key in initialParticipants) {
      if(!participantsByName[key]) {
        removedParticipants[key] = true;
      }
    }

    let editorsByName = {};
    
    for (const key in editors) {
      if (typeof editors[key] === 'object') {
        editorsByName = { ...editorsByName, ...editors[key] };      
        continue;
      } 

      editorsByName[key] = true;
    }

    const userAvatar = userData?.photoUrl ? userData?.photoUrl : '';

    updateEvent(eventId, title, description, startDate, endDate, address, isPublic, isOnline, selectedCategory,
      reoccurring, latitude, longitude, selectedImage, photoUrl, participantsByName, editorsByName, isAllDay, 
      newlyAddedParticipants, userData?.userName, userAvatar, reminderDate, reminderId, removedParticipants)
      .then(() => {
        toast({
          title: 'Event updated successfully!',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        props.handleEditEventSuccess();
      })
      .catch((error) => {
        console.error('Error updating event:', error);
        toast({
          title: 'Error updating event.',
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      });
  };

  return (
    <Box m='auto' pb={ 4 } as='form' onSubmit={ handleSubmit }>
      <Flex>
        <FormControl isRequired isInvalid={ errors.title }>
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
          />
        </div>
      </FormControl>
      <EditEventCover
        selectedImage={ selectedImage }
        setSelectedImage={ setSelectedImage }
        photoUrl={ props.event.photoUrl }
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
          Confirm Changes
        </Button>
      </Center>
    </Box>
  );
};

export default EditEventForm;

EditEventForm.propTypes = {
  event: PropTypes.object,
  onClose: PropTypes.func,
  handleEditEventSuccess: PropTypes.func,
};
