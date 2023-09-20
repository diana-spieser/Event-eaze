import {
  Box,
  Grid,
  GridItem,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';
import { parseISO } from 'date-fns';
import { getEventsByUserName } from '../../services/event.services';
import { useContext, useEffect, useState } from 'react';
import UpcomingEvents from '../../components/Dashboard/UpcomingEvents';
import AuthContext from '../../context/AuthContext';
import MyClock from '../Widgets/Clock/Clock';
import WeatherCard from '../Widgets/Weather';
import SmallCalendar from '../Widgets/SmallCalendar';
import QuoteDisplay from '../Widgets/QuoteDisplay';
import Profile from './DashProfile';


function Layout() {
  const { userData } = useContext(AuthContext);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const clockColSpan = useBreakpointValue({ base: 6, md: 1 });
  const weatherColSpan = useBreakpointValue({ base: 6, md: 2 });
  const upcomingEventsColSpan = useBreakpointValue({ base: 6, md: 3 });
  const calendarColSpan = useBreakpointValue({ base: 6, md: 3 });
  const quoteDisplayColSpan = useBreakpointValue({ base: 6, md: 3 });
  const gridItemColumns = useBreakpointValue({ base: 6, md: 1 });
  const { colorMode } = useColorMode();


  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);
        if (userData) {
          getEventsByUserName(userData.userName.toLowerCase())
            .then((events) => {
              events.sort(
                (a, b) => parseISO(a.startDate) - parseISO(b.startDate)
              );
              const mostRecentEvents = events.slice(0, 3);
              setUpcomingEvents(mostRecentEvents);
            })
            .catch((error) => {
              console.error('Error fetching upcoming events:', error);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    if (userData) {
      fetchData();
    }
  }, [userData]);

  const gradientBackground =
    colorMode === 'light'
      ? 'linear-gradient(to bottom, #60efff, #0061ff)'
      : 'linear-gradient(to bottom, #4E50FB, #150A80)';

  return (
    <Box maxW='9xl' mx='auto' px={ { base: 2, sm: 12, md: 17 } }>
      <Grid
        h='100vh'
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(6, 1fr)'
        gap={ 4 }
        borderRadius={ 'lg' }
      >
        {gridItemColumns !== 6 && (
          <GridItem
            colSpan={ 6 }
            rowSpan={ 1 }
            borderWidth='1px'
            shadow='md'
            rounded='lg'
            bg={ gradientBackground }
          >
            <Profile />
          </GridItem>
        )}
        <GridItem
          colSpan={ clockColSpan }
          borderWidth='1px'
          shadow='md'
          rounded='lg'
          bg={ gradientBackground }
        >
          <MyClock />
        </GridItem>
        <GridItem
          colSpan={ weatherColSpan }
          borderWidth='1px'
          shadow='md'
          rounded='lg'
          bg={ gradientBackground }
        >
          <WeatherCard />
        </GridItem>

        <GridItem
          rowSpan={ upcomingEventsColSpan }
          colSpan={ upcomingEventsColSpan }
          borderWidth='1px'
          shadow='md'
          rounded='lg'
          bg={ gradientBackground }
        >
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <UpcomingEvents events={ upcomingEvents } />
          )}
        </GridItem>
        <GridItem
          colSpan={ calendarColSpan }
          borderWidth='1px'
          shadow='md'
          rounded='lg'
          bg={ gradientBackground }
        >
          <Box p={ 4 }>
            <SmallCalendar />
          </Box>
        </GridItem>
        <GridItem
          colSpan={ quoteDisplayColSpan }
          borderWidth='1px'
          shadow='md'
          rounded='lg'
          bg={ gradientBackground }
        >
          <QuoteDisplay />
        </GridItem>
      </Grid>
    </Box>
  );
}

export default Layout;
