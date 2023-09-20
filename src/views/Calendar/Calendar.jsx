import { useState, useEffect } from 'react';
import {
  Flex,
  Button,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { MdWork, MdCalendarViewWeek } from 'react-icons/md';
import { IoCalendarNumberSharp } from 'react-icons/io5';
import { RiCalendarFill } from 'react-icons/ri';
import { BsFillCalendarEventFill } from 'react-icons/bs';
import DayCalendar from '../../components/Calendar/Day/DayCalendar';
import MonthCalendar from '../../components/Calendar/Month/MonthCalendar';
import WeekCalendar from '../../components/Calendar/Week/WeekCalendar';
import YearCalendar from '../../components/Calendar/Year/YearCalendar';

function Calendar() {
  const [selectedOption, setSelectedOption] = useState('Week');
  const [selectedView, setSelectedView] = useState(
    localStorage.getItem('lastSelectedView') || 'Month'
  ); 
  const [isMobile] = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    localStorage.setItem('lastSelectedView', selectedView);
  }, [selectedView]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    handleViewSelect(option);
  };

  const handleViewSelect = (view) => {
    setSelectedView(view);
  };

  return (
    <Box>
      <Flex mb={ isMobile ? 14 : 5 }>
        <Button
         
          height={ isMobile ? '30px' : '40px' }
          mr={ 2 }
          onClick={ () => setSelectedView('Day') }
          leftIcon={ <RiCalendarFill /> }
        >
           Day
        </Button>{' '}
        <Menu>
          <MenuButton as={ Button } height={ isMobile ? '30px' : 'auto' } mr={ 2 }>
            {selectedOption} <ChevronDownIcon />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={ () => handleOptionSelect('Week') }>
              <MdCalendarViewWeek /> Week
            </MenuItem>
            <MenuItem onClick={ () => handleOptionSelect('Work Week') }>
              <MdWork /> Work Week
            </MenuItem>
          </MenuList>
        </Menu>
        <Button
          
          height={ isMobile ? '30px' : 'auto' }
          mr={ 2 }
          leftIcon={ <IoCalendarNumberSharp /> }
          onClick={ () => setSelectedView('Month') }
        >
          Month
        </Button>
        <Button
          onClick={ () => setSelectedView('Year') }
          
          height={ isMobile ? '30px' : '40px' }
          leftIcon={ <BsFillCalendarEventFill /> }
        >
            Year
        </Button>
      </Flex>
      {selectedView === 'Month' && <MonthCalendar />}
      {selectedView === 'Day' && <DayCalendar />}
      {selectedView === 'Week' && <WeekCalendar fullWeek={ true } />}
      {selectedView === 'Work Week' && <WeekCalendar fullWeek={ false } />}
      {selectedView === 'Year' && <YearCalendar />}
    </Box>
  );
}

export default Calendar;
