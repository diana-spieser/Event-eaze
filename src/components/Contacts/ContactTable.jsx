import { userStatusListener } from '../../services/contacts.service';
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, useColorModeValue, } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import SingleUserCard from './SingleUserCard';
import PropTypes from 'prop-types';

function ContactTable({ contacts, contactLists }) {
  const [displayedContacts, setDisplayedContacts] = useState([]);
  const [visibleContacts, setVisibleContacts] = useState(8);
  const [statuses, setStatuses ] = useState({});
  
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    setDisplayedContacts(contacts.slice(0, visibleContacts));
  }, [contacts, visibleContacts]);

  useEffect(() => {
    let unsubscribe;

    if (contacts) {
      unsubscribe = userStatusListener(setStatuses);
    }

    return () => {
      if(unsubscribe) {
        return unsubscribe;
      }
    };
  }, [contacts]);
    
  const userOnline = (userName) => {
    if (statuses) {
      const user = userName.toLowerCase();
      return statuses[user];
    }
    return false;
  };
  
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setVisibleContacts((prevVisible) => prevVisible + 8);
    }
  };
  
  return (
    <TableContainer h='710px' 
      onScroll={ handleScroll }
      overflowY='auto' css={ {
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
      <Table variant='simple' color={ textColor }>
        <Thead>
          <Tr my='.8rem' pl='0px'>
            <Th color='gray.400' borderColor={ borderColor } pr={ '0' }>
                Contact Details
            </Th>
            <Th color='gray.400' borderColor={ borderColor } pr={ '0' }>

            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {displayedContacts.length === 0 ? (
            <Tr>
              <Td colSpan={ 3 } textAlign='center'>
                  No contacts found
              </Td>
            </Tr>
          ) : (displayedContacts.map((user) => (
            <SingleUserCard key={ user.uid } user={ user } userOnline={ userOnline } contactLists={ contactLists } />
          )))}
        </Tbody>
        <Tfoot mb={ 4 }>
          <Tr>
            <Th>Total: {contacts.length}</Th>
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
  );
}

ContactTable.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object),
  contactLists: PropTypes.arrayOf(PropTypes.object),
};

export default ContactTable;
