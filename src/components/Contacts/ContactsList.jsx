import { CardContainer } from '../Base/Containers';
import { getUserByHandle, getAllUsers } from '../../services/user.service';
import { contactListsListener } from '../../services/contacts.service';
import { searchUsers } from '../../services/search.service';
import { Flex, Grid, Heading, Stack } from '@chakra-ui/react';
import { FaArrowCircleLeft, FaUsers } from 'react-icons/fa';
import { useEffect, useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ContactMenu from './Menu/ContactMenu';
import ContactTable from './ContactTable';
import SearchBar from '../Search/SearchBar';
import AuthContext from '../../context/AuthContext';
import IMAGES from '../../assets/images/Images';

function ContactsList() {
  const { userData } = useContext(AuthContext);
  const [allContacts, setAllContacts] = useState([]);
  const [contactLists, setContactLists] = useState(null);
  const [contactsByList, setContactsByList] = useState([]);
  const [currentView, setCurrentView] = useState('All Contacts');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    let unsubscribe;

    if(userData?.contacts) {
      getAllUsers()
        .then((snapshot) => {
          if (snapshot.exists()) {
            setAllUsers(Object.values(snapshot.val()));
            const userContactsSet = new Set(Object.keys(userData?.contacts));
            const userContactsArray = Object.values(snapshot.val())
              .filter(user => userContactsSet.has(user.userName.toLowerCase()));
            setAllContacts(userContactsArray);
          } 
        }
        )
        .catch((error) => {
          console.error('Error fetching all users:', error);
        });
    } else {
      setAllContacts([]);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };

  }, [userData?.contacts]);
 
  useEffect(() => {
    let unsubscribe;

    if (userData?.userName) {
      unsubscribe = contactListsListener(userData.userName, setContactLists);
    }
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userData?.userName]);

  useEffect(() => {
    if(contactLists && currentView !== 'All Contacts' && currentView !== 'All Users') {
      const view = contactLists.filter(list => list.title === currentView);

      if(view[0].contacts)  {        
        const userPromises = Object.keys(view[0].contacts).map(contact => getUserByHandle(contact));
        Promise.all(userPromises)
          .then(snapshots => {
            const users = snapshots.map(snapshot => snapshot.val());
            setContactsByList(users);
          })
          .catch(e => console.error('Error getting users:', e));
      } else {
        setContactsByList([]);
      }     
    }
  },[currentView, contactLists]);

  useEffect(() => {
    const queryParam = new URLSearchParams(location.search).get('query');
    setIsSearching(!!queryParam);
    if (queryParam) {
      searchUsers(queryParam)
        .then((userResults) => {
          setSearchResults(userResults);
          setSearchQuery(queryParam);
        })
        .catch((error) => {
          console.error('Error encountered:', error);
        });
    }
  }, [location.search]);

  function getViewContacts() {
    if (isSearching) {
      return searchResults;
    } else if (currentView === 'All Contacts') {
      return allContacts;
    } else if (currentView === 'All Users') {
      return allUsers;
    } else if (currentView !== 'All Contacts' && !isSearching) {
      return contactsByList;
    }

    return [];
  }

  const handleSearch = (query) => {
    navigate(`/contacts?query=${query}`); 
  };

  const handleContactsLinkClick = () => {
    navigate('/contacts');
    setCurrentView('All Contacts');
    setClearSearch(prev => !prev);
  };

  return (
    <Grid templateColumns={ ['1fr', '4fr 2fr'] } gap={ 6 } align={ 'top' }>
      <Flex direction='column'>
        <Flex justify='space-between' alignItems='center' 
          ml={ 5 } mb={ 6 }  direction={ { base: 'column', md: 'row' } }>
          <Flex align='center' justify='space-between' mb={ { base: 4 , md: 0 } }>
            {isSearching ? (
              <Link onClick={ handleContactsLinkClick }>
                <FaArrowCircleLeft size={ 30 } color='#FF4500' />
              </Link>
            ) : (
              <Link onClick={ handleContactsLinkClick }>
                <FaUsers size={ 30 } color='#FF4500' />
              </Link>
            )}
            <Heading as='h2' size='md' ml={ 4 }>
              {isSearching
                ? `Search Results for '${searchQuery}'`
                : currentView}
            </Heading>
          </Flex>
          <SearchBar onSearch={ handleSearch }
            clearSearch={ clearSearch } 
            currentView={ currentView }
          />
        </Flex>
        <CardContainer>
          <ContactTable
            contacts={ getViewContacts() }
            contactLists={ contactLists }
          />
        </CardContainer>
      </Flex>
      <Stack>
        <Flex justify='center ' alignItems='center'>
          <img height='100px' src={ IMAGES.contact } alt='Contacts' />
        </Flex>
        <ContactMenu
          currentView={ currentView }
          setCurrentView={ setCurrentView }
          contactLists={ contactLists }
          allContacts={ allContacts }
          isSearching={ isSearching }
        />
      </Stack>
    </Grid>
  );
}

export default ContactsList;
