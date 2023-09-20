import { Flex, Heading, Spinner } from '@chakra-ui/react';
import { useState, useContext, useEffect } from 'react';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { AiOutlineSound } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { getEventsByUserName, getAllPublicEvents, getAllEvents, } from '../../services/event.services';
import { searchEvents } from '../../services/search.service';
import { calculateEventCountsByCategory } from '../../common/helpers/EventHelpers';
import SearchBar from '../Search/SearchBar';
import AuthContext from '../../context/AuthContext';
import EventCard from './EventCard';
import EventControls from './EventControls';

function EventsList() {
  const { userData } = useContext(AuthContext);
  const [userEvents, setUserEvents] = useState([]);
  const [publicEvents, setPublicEvents] = useState([]);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [eventCountsByCategory, setEventCountsByCategory] = useState({});
  const [activeTab, setActiveTab] = useState('myEvents');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentEventSource, setCurrentEventSource] = useState('userEvents');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clearSearch, setClearSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = () => {
      try {
        setIsLoading(true);
        if (userData) {
          getEventsByUserName(userData.userName.toLowerCase())
            .then((userEventsData) => {
              setUserEvents(userEventsData);
              setCurrentEvents(userEventsData);
              const userEventCounts =
                calculateEventCountsByCategory(userEventsData);
              setEventCountsByCategory((prevCounts) => ({
                ...prevCounts,
                userEvents: userEventCounts,
              }));
              setIsLoading(false);
            })
            .catch((error) => {
              console.error('Error fetching user events:', error);
              setIsLoading(false);
            });
        }
      } catch (error) {
        console.error('Error fetching user events:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  useEffect(() => {
    if (currentEventSource === 'publicEvents') {
      setIsLoading(true);
      getAllPublicEvents()
        .then((fetchedPublicEvents) => {
          setPublicEvents(fetchedPublicEvents);
          setCurrentEvents(fetchedPublicEvents);
          const publicEventCounts =
            calculateEventCountsByCategory(fetchedPublicEvents);
          setEventCountsByCategory((prevCounts) => ({
            ...prevCounts,
            publicEvents: publicEventCounts,
          }));
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching public events:', error);
          setIsLoading(false);
        });
    }
  }, [currentEventSource, userData]);

  useEffect(() => {
    if (userData && currentEventSource === 'allEvents') {
      getAllEvents()
        .then((fetchedAllEvents) => {
          const categoryCounts =
            calculateEventCountsByCategory(fetchedAllEvents);
          setEventCountsByCategory((prevCounts) => ({
            ...prevCounts,
            allEvents: categoryCounts,
          }));

          setCurrentEvents(fetchedAllEvents);
        })
        .catch((error) => {
          console.error('Error fetching all events:', error);
        });
    }
  }, [userData, currentEventSource]);

  const filteredEvents = currentEvents.filter((event) => {
    if (!selectedCategory) {
      return true;
    }
    return event.categoryId === selectedCategory;
  });


  const switchToAllEvents = () => {
    setSelectedCategory('');
    setCurrentEventSource('allEvents');
    setCurrentEvents([]);
  };

  const switchToMyEvents = () => {
    setSelectedCategory('');
    setCurrentEventSource('userEvents');
    setCurrentEvents(isSearching ? searchResults : userEvents);
  };

  const switchToPublicEvents = () => {
    setSelectedCategory('');
    setCurrentEventSource('publicEvents');

    if (isSearching) {
      setCurrentEvents(searchResults);
    } else {
      setCurrentEvents(publicEvents);
    }
  };

  const isAdmin = userData && userData.role === 'Admin';
  const authorUserName = userData && userData.userName;

  const handleSearch = (query) => {
    searchEvents(query, isAdmin, authorUserName)
      .then((searchResults) => {
        navigate(`/events?query=${query}`);
        setSearchResults(searchResults);
        setSearchQuery(query);
        setIsSearching(true);
        setCurrentEvents(searchResults);
      })
      .catch((error) => {
        console.error('Error encountered:', error);
      });
  };

  const handleEventsLinkClick = () => {
    navigate('/events');
    setIsSearching(false);
    setSearchResults([]);
    setCurrentEventSource('publicEvents');
    setCurrentEvents(publicEvents);

    setClearSearch((prev) => !prev);
  };

  const getHeadingText = () => {
    if (isSearching) {
      return `Search Results for '${searchQuery}'`;
    } else if (selectedCategory) {
      return `Filtered Events (${filteredEvents.length})`;
    } else {
      switch (currentEventSource) {
        case 'allEvents':
          return `All Events (${currentEvents.length})`;
        case 'publicEvents':
          return `Public Events (${currentEvents.length})`;
        case 'userEvents':
          return `My Events (${currentEvents.length})`;
        default:
          return '';
      }
    }
  };

  return (
    <>
      <Flex direction='column'>
        <Flex
          justify='space-between'
          alignItems='center'
          ml={ { base: 3, md: 5, lg: 10 } }
          mb={ 6 }
          flexWrap='wrap'
        >
          <Flex align='center' justify='space-between' mb={ { base: 3, md: 0 } }>
            {isSearching ? (
              <Link
                onClick={ () => {
                  setIsSearching(false);
                  handleEventsLinkClick();
                } }
              >
                <FaArrowCircleLeft size={ 30 } color='#FF4500' />
              </Link>
            ) : (
              <Link onClick={ () => setIsSearching(true) }>
                <AiOutlineSound size={ 30 } color='#FF4500' />
              </Link>
            )}
            <Heading as='h2' size='md' ml={ { base: 2, md: 4 } }>
              {getHeadingText()}
            </Heading>
          </Flex>
          <EventControls
            activeTab={ activeTab }
            setActiveTab={ setActiveTab }
            switchToPublicEvents={ switchToPublicEvents }
            switchToMyEvents={ switchToMyEvents }
            isAdmin={ isAdmin }
            switchToAllEvents={ switchToAllEvents }
            setSelectedCategory={ setSelectedCategory }
            selectedCategory={ selectedCategory }
            eventCountsByCategory={ eventCountsByCategory[currentEventSource] }
            setCurrentEventSource={ setCurrentEventSource }
          />
          <SearchBar onSearch={ handleSearch } clearSearch={ clearSearch } />
        </Flex>
        {isLoading ? (
          <Flex justify='center' align='center' height='100vh'>
            <Spinner size='xl' />
          </Flex>
        ) : isSearching ? (
          searchResults.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <EventCard events={ searchResults } />
          )
        ) : selectedCategory ? (
          <EventCard events={ filteredEvents } />
        ) : (
          <EventCard events={ currentEvents } />
        )}
      </Flex>
    </>
  );
}

export default EventsList;
