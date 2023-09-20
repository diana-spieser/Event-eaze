import { FormLabel, FormControl, Select, FormErrorMessage, Flex, HStack, Switch,useColorMode } from '@chakra-ui/react';
import { useState } from 'react';
import { isSameDay } from 'date-fns';
import DatePicker from 'react-datepicker';
import '../CreateEventForm/CreateEventForm.css';
import 'react-datepicker/dist/react-datepicker.css';
import addMinutes from 'date-fns/addMinutes';
import '../CreateEventForm/CreateEventForm.css';
import PropTypes from 'prop-types';

function SchedulingOptions({ startDate, setStartDate, endDate, setEndDate, setIsAllDay, setReoccurring, errors,
  reoccurring, isAllDay }) {
  const [previousDates, setPreviousDates] = useState({});
  const { colorMode } = useColorMode();

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (!endDate) {
      const newEndDate = new Date(date);
      newEndDate.setHours(newEndDate.getHours() + 1);

      setEndDate(newEndDate);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleAllDayToggle = (e) => {
    setIsAllDay(e.target.checked);

    if (e.target.checked) {
      if (startDate === null || isSameDay(startDate, new Date())) {
        const remainderOfDay = addMinutes(new Date(), 30 - (new Date().getMinutes() % 30));
        setStartDate(remainderOfDay);

        if (!endDate) {
          const endOfDay = new Date();
          endOfDay.setHours(23, 59, 59, 999);
          setEndDate(endOfDay);
        } else {
          const endOfSelectedDay = new Date(endDate);
          endOfSelectedDay.setHours(23, 59, 59, 999);
          setEndDate(endOfSelectedDay);
        }
        setPreviousDates({ startDate, endDate });
      } else {
        setPreviousDates({ startDate, endDate });

        const newStartDate = new Date(startDate);
        newStartDate.setHours(0, 0, 0, 0);

        const newEndDate = new Date(endDate);
        newEndDate.setHours(23, 59, 59, 999);

        setStartDate(newStartDate);
        setEndDate(newEndDate);
      }
    } else {
      if (previousDates.startDate && previousDates.endDate) {
        setStartDate(new Date(previousDates.startDate));
        setEndDate(new Date(previousDates.endDate));
      } else {
        setStartDate(null);
        setEndDate(null);
      }
    }
  };


  return (
    <>
      <Flex mt={ 2 }>
        <FormControl
          isRequired
          isInvalid={ errors.startDate }
          border={ 0 }
          color='none'
        >
          <FormLabel>Start Date</FormLabel>
          <div className={ colorMode === 'light' ? 'light-theme' : 'dark-theme' }>
            <DatePicker
              selected={ startDate }
              onChange={ handleStartDateChange }
              showTimeSelect
              startDate={ startDate }
              endDate={ endDate }
              selectsStart
              dateFormat='Pp'
              wrapperClassName='date_picker full-width'
              minDate={ new Date() }
              className={ `${
                errors.startDate ? 'border-red-500' : 'border-gray-300'
              } p-2 rounded-md` }
              placeholderText='  Select date'
            />
          </div>
          <FormErrorMessage>{errors.startDate}</FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={ errors.endDate } ml={ 2 }>
          <FormLabel>End Date</FormLabel>
          <div className={ colorMode === 'light' ? 'light-theme' : 'dark-theme' }>
            <DatePicker
              selected={ endDate }
              onChange={ handleEndDateChange }
              showTimeSelect
              dateFormat='Pp'
              minDate={ startDate }
              startDate={ startDate }
              endDate={ endDate }
              value={ startDate }
              selectsEnd
              className={ `${
                errors.endDate ? 'border-red-500' : 'border-gray-300'
              } p-2 rounded-md` }
              placeholderText='  Select date'
            />
          </div>
          <FormErrorMessage>{errors.endDate}</FormErrorMessage>
        </FormControl>
      </Flex>
      <HStack mt={ 2 }>
        <FormControl w={ '120px' } isRequired>
          <FormLabel>Repeat</FormLabel>
          <Select
            defaultValue={ reoccurring }
            onChange={ (e) => setReoccurring(e.target.value) }
          >
            <option value='never'>Never</option>
            <option value='daily'>Daily</option>
            <option value='weekly'>Weekly</option>
            <option value='monthly'>Monthly</option>
          </Select>
        </FormControl>
        <Switch
          onChange={ handleAllDayToggle }
          defaultChecked={ isAllDay }
          mt={ 8 }
          colorScheme='orange'
        >
          All day
        </Switch>
      </HStack>
    </>
  );
}

export default SchedulingOptions;

SchedulingOptions.propTypes = {
  startDate: PropTypes.any,
  setStartDate: PropTypes.func,
  endDate: PropTypes.any,
  setEndDate: PropTypes.func,
  setIsAllDay: PropTypes.func,
  setReoccurring: PropTypes.func,
  errors: PropTypes.any,
  reoccurring: PropTypes.string,
  isAllDay: PropTypes.bool
};
