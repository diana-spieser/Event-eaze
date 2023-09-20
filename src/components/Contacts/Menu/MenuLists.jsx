import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccordionItem, AccordionButton, AccordionPanel, Flex, Text, Avatar } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import SingleContactList from './SingleContactList';
import AuthContext from '../../../context/AuthContext';
import colors from '../../../theme/colors';
import IMAGES from '../../../assets/images/Images';
import PropTypes from 'prop-types';

function MenuLists({ currentView, setCurrentView, contactLists, allContacts, isSearching }) {
  const { userData } = useContext(AuthContext);
  const [displayedContactLists, setDisplayedContactLists] = useState([]);
  const [visibleContactLists, setVisibleContactLists] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    if(contactLists) {
      setDisplayedContactLists(contactLists.slice(0, visibleContactLists));
    }
  }, [contactLists, visibleContactLists]);

  const isSelected = (menuItem) => {
    return !isSearching && currentView === menuItem ? 
      colors.accent.primary : null;
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setVisibleContactLists((prevVisible) => prevVisible + 8);
    }
  };
      
  return (
    <AccordionItem maxH='400px' overflowY='auto' 
      onScroll={ handleScroll }
      css={ {
        '&::-webkit-scrollbar': {
          width: '7px',
        },
        '&::-webkit-scrollbar-track': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'grey',
          borderRadius: '24px',
        },
      } }>         
      <AccordionButton
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        p={ 4 }
        _hover={ { bg: colors.accent.primary } }
        borderRadius={ 'md' }
      >
        <Text fontSize='md'>Contact Lists</Text>
        <ChevronDownIcon fontSize='24px' />
      </AccordionButton>
      <AccordionPanel>
        <Flex direction='column' w='100%'>
          <Flex justifyContent='space-between'>
            <Flex align='center'>
              <Avatar src={ IMAGES.hero } me='10px' />
              <Flex direction='column'>
                <Text
                  fontSize='sm'
                  fontWeight='bold'
                  cursor='pointer'
                  userSelect='none'
                  letterSpacing='0.06em'
                  color={ isSelected('All Contacts') }                      
                  onClick={ () => {
                    setCurrentView('All Contacts');
                    navigate('/contacts');                  
                  } }
                >
                All Contacts
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </AccordionPanel>
      {userData?.role === 'Admin' && (<AccordionPanel>
        <Flex direction='column' w='100%'>
          <Flex justifyContent='space-between'>
            <Flex align='center'>
              <Avatar src={ IMAGES.hero } me='10px' />
              <Flex direction='column'>
                <Text
                  fontSize='sm'
                  fontWeight='bold'
                  cursor='pointer'
                  userSelect='none'
                  letterSpacing='0.06em'
                  color={ isSelected('All Users') }                      
                  onClick={ () => {
                    setCurrentView('All Users');
                    navigate('/contacts');                  
                  } }
                >
                All Users
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </AccordionPanel>)}
      {displayedContactLists && displayedContactLists.map(list => {
        return (  
          <SingleContactList
            key={ list.title + list.key } 
            list={ list }
            isSelected={ isSelected }
            allContacts={ allContacts }
            setCurrentView={ setCurrentView }
          />);
      })}
    </AccordionItem>
  );
}

export default MenuLists;
  
MenuLists.propTypes = {
  currentView: PropTypes.string,
  setCurrentView: PropTypes.func,
  contactLists: PropTypes.arrayOf(PropTypes.object),
  allContacts: PropTypes.arrayOf(PropTypes.object),
  isSearching: PropTypes.bool
};
  