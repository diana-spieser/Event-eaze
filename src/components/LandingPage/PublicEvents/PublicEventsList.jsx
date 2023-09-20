/* eslint-disable no-unused-vars */
import  { useEffect, useState } from 'react';
import { AiOutlineSound } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

import { getAllPublicEvents } from '../../../services/event.services';
import SearchBar from '../../Search/SearchBar';
import PublicEventCard from './PublicEventCard';

function PublicEventsList() {
  const [publicEvents, setPublicEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [clearSearch, setClearSearch] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState(4);
  const [showMore, setShowMore] = useState(true);


  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      getAllPublicEvents()
        .then((fetchedPublicEvents) => {
          setPublicEvents(fetchedPublicEvents);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching public events:', error);
          setIsLoading(false);
        });
    };

    fetchData();
  }, []);

  const getVisibleEvents = () => {
    return publicEvents.slice(0, showMore ? visibleEvents : publicEvents.length);
  };

  const handleLoadMore = () => {
    setShowMore((prevShowMore) => !prevShowMore);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
    } else {
      const results = publicEvents.filter((event) => {
        const titleMatch = event.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const descriptionMatch = event.description
          .toLowerCase()
          .includes(query.toLowerCase());
        return titleMatch || descriptionMatch;
      });

      setSearchResults(results);
      setIsSearching(true);
    }
  };

  const getHeadingText = () => {
    if (isSearching) {
      return `Search Results for "${searchQuery}"`;
    } else {
      return 'Our Events';
    }
  };

  return (
    <>
      <Box py={ 12 }>
        <VStack spacing={ 2 } textAlign='center'>
          <Heading as='h1' fontSize='4xl'>
            {getHeadingText()}
          </Heading>
          <Text fontSize='lg' color={ 'gray.500' }>
            Browse public events and get subscribed to see full event details.
          </Text>
        </VStack>
        <Flex direction='column' m='auto' p='5'>
          <Flex
            justify='space-between'
            alignItems='center'
            ml={ { base: 3, md: 5, lg: 10 } }
            mb={ 6 }
            flexWrap='wrap'
          >
            <Flex
              align='center'
              justify='space-between'
              mb={ { base: 3, md: 0 } }
            >
              {isSearching ? (
                <Link onClick={ () => setIsSearching(false) }>
                </Link>
              ) : (
                <Heading as='h2' size='md' ml={ { base: 2, md: 4 } }>
                  {getHeadingText()}
                </Heading>
              )}
            </Flex>

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
              <>
                <PublicEventCard events={ searchResults } />
              </>
            )
          ) : (
            <>
              <PublicEventCard events={ getVisibleEvents() } />
              {publicEvents.length > visibleEvents && (
                <Flex justify='center' align='center'>
                  <Button
                    onClick={ handleLoadMore }
                    bg={ 'accent.primary' }
                    color={ 'white' }
                    size={ 'lg' }
                    mt={ 4 }
                  >
                    {showMore ? 'See More' : 'See Less'}
                  </Button>
                </Flex>
              )}
            </>
          )}
        </Flex>
      </Box>
    </>
  );
}

export default PublicEventsList;
