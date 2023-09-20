import { useState, useEffect, useContext } from 'react';
import { Box, Center, Flex, Text, useMediaQuery, 
  Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  addDays, 
  startOfDay, 
  isWeekend, 
  getDate, 
  getDay,
  isSameDay } from 'date-fns';
import { useColorMode } from '@chakra-ui/react';
import { getEventsByUserName } from '../../../services/event.services'; 
import CalendarNavigation from '../CalendarNavigation';
import AuthContext from '../../../context/AuthContext';
import EventPopover from '../EventPopover';
import holidays from 'date-holidays';

const MonthCalendar = () => {
  const { userData } = useContext(AuthContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]); 
  const [onEdit, setOnEdit] = useState(false);
  const [isMobile] = useMediaQuery('(max-width: 1067px)');
  const { colorMode } = useColorMode();
  const hd = new holidays();
  hd.init('BG'); 
  hd.setLanguages('en'); 

  const borderColor = colorMode === 'dark' ? '#27374c' : '#E2E8F0'; 
  const weekendColour = colorMode === 'dark' ? '#272c2e' : '#edf2f7';
  const daysOfWeekColor = colorMode === 'dark' ? '#1a202c' : '#fcfeff';
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date();

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const thisMonth = () => {
    setCurrentMonth(new Date());
  };
  
  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
    
  const calendar = [];
  let currentDate = startOfDay(startDate); 
  
  while (currentDate <= endMonth) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    calendar.push(week);
  }

  const getEventsOnDate = (date) => {
    return events.filter((event) => {
      const eventStartDate = startOfDay(event.startDate);
      const eventEndDate = startOfDay(event.endDate);

      if (event.reoccurring === 'daily' &&  eventStartDate <= date) {
        return true;
      } else if (event.reoccurring === 'weekly' && eventStartDate <= date) {
        return getDay(date) === getDay(eventStartDate);
      } else if (event.reoccurring === 'monthly' && eventStartDate <= date) {
        return getDate(date) === getDate(eventStartDate);
      } else if (event.reoccurring === 'never') {
        return isDateWithinEvent(date, eventStartDate, eventEndDate);
      }
    });
  };

  useEffect(() => {
    if (userData?.userName) {
      getEventsByUserName(userData?.userName)
        .then((eventData) => {
          getEventsOnDate(eventData);
          setEvents(eventData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userData?.userName, currentMonth, userData?.events, onEdit]);
  
  const isDateWithinEvent = (date, startDate, endDate) => {
    return date >= startDate && date <= endDate;
  };
  

  return (
    <Box>
      <CalendarNavigation onPrev={ prevMonth } onNext={ nextMonth } title='Month' today={ thisMonth } />
      <Text
        textAlign='center'
        fontWeight='bold'
        color={ format(currentMonth, 'MMMM') === format(today, 'MMMM') ? '#ff5414' : 'inherit' }
        fontSize={ isMobile ? 14 : 19 }
        mt={ isMobile ? 19 : 1 }
      >{`${format(currentMonth, 'MMMM')} ${format(currentMonth, 'yyyy')}`}</Text>
      <Box height='65vh' overflowY='scroll'>
        <Flex align={ isMobile ? 'none' : 'center' } direction='column'>
          <Flex position='sticky' top={ 0 } zIndex={ 2 }>
            {daysOfWeek.map((day, index) => (
              <Center key={ index } width='150px' height='50px'  fontWeight='bold' backgroundColor={ daysOfWeekColor }>
                {isMobile ? day.slice(0, 3) : day}
              </Center>
            ))}
          </Flex>
          {calendar.map((week, weekIndex) => (
            <Flex key={ weekIndex }>
              {week.map((day, dayIndex) => {              
                const isCurrentMonth = day >= startMonth && day <= endMonth;
                const isToday = isSameDay(day, today);
                const eventsOnDate = getEventsOnDate(day);
                const isHoliday = hd.isHoliday(new Date(day));
                return (
                  <Center
                    key={ dayIndex }
                    width='150px'
                    background={ isWeekend(day) ? weekendColour : 'inherit' }
                    height={ isMobile ? '130px' : '150px' }
                    borderBottom={ `1px solid ${borderColor}` }
                    borderTop={ `1px solid ${borderColor}` }
                    position='relative'
                    transition='background-color 0.3s'
                    _hover={ { backgroundColor: borderColor } }
                  >
                    {isCurrentMonth && (
                      <>                  
                        <Text
                          position='absolute'
                          top='10px'
                          left='10px'
                          background={ isToday ? '#ff5414' : 'inherit' }
                          color={ isToday ? 'white' : 'inherit' }
                          borderRadius='50%'
                          padding='5px'
                          width='33px'
                          textAlign='center'
                        >
                          {format(day, 'd')} 
                        </Text>
                        <Text fontSize={ 10 } 
                          color={ '#ff5414' } 
                          position='absolute'  
                          top='37px'    
                          padding='5px'
                          left='13px'>{isHoliday.length && isHoliday[0].name}</Text>  
                        {eventsOnDate.map((event, index) => {        
                          const isEventStart = isSameDay(day, event.startDate);
                          const isEventEnd = isSameDay(day, event.endDate);
                          
                          if (index <= 2) {
                            return (
                              <Popover  key={ event.id }>
                                <PopoverTrigger >
                                  <Box
                                    key={ event.id }
                                    position='absolute'
                                    bottom={ `${10 + 20 * index}px` }
                                    left='10px'
                                    background='#6693f2'
                                    borderRadius={ isMobile ? '50%' : '5px' }
                                    padding='2px 4px'
                                    margin='2px 0px'
                                    color='white'
                                    fontSize='12px'
                                    whiteSpace='nowrap'
                                    width={ isMobile ? isEventStart && isEventEnd ? '40%' : '40%'   : 
                                      isEventStart && isEventEnd ? 'auto' : 'auto' }
                                    cursor='pointer'
                                    overflow='hidden'
                                  >
                                    {isEventStart && isEventEnd
                                      ? event.title
                                      : isEventStart
                                        ? `Start: ${event.title}`
                                        : isEventEnd
                                          ? `End: ${event.title}`
                                          : event.title}
                                  </Box>
                                </PopoverTrigger>
                                <PopoverContent width='auto'>
                                  <EventPopover event={ event } userData={ userData } setOnEdit={ setOnEdit } />
                                </PopoverContent>
                              </Popover>
                            );
                          } else if (index === 3) {
                            return (
                              <Box
                                key={ event.id }
                                position='absolute'
                                bottom={ `${10 + 20 * index}px` }
                                left='10px'
                                background='#6693f2'
                                borderRadius='10px'
                                padding='2px'
                                textAlign='center'
                                color='white'
                                fontSize='12px'
                                whiteSpace='nowrap'
                                overflow='hidden'
                                width={ isEventStart && isEventEnd ? '40%' : 'auto' }
                              >
                                +{eventsOnDate.length - 3} more
                              </Box>
                            );
                          }
                          return null;       
                        })}
                      </>
                    )}
                  </Center>
                );
              })}
            </Flex>
          ))}
        </Flex>
      </Box>
    </Box>
  );
};

export default MonthCalendar;