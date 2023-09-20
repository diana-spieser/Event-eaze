import { updateContactsInList } from '../../../services/contacts.service';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccordionPanel, Flex, Text, Button, Avatar, Menu, MenuButton, MenuList, 
  MenuItem, MenuOptionGroup, Checkbox, } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { deleteContactList } from '../../../services/contacts.service';
import { useContext } from 'react';
import ConfirmationAlert from '../../Base/ConfirmationAlert';
import IMAGES from '../../../assets/images/Images';
import AuthContext from '../../../context/AuthContext';
import PropTypes from 'prop-types';
      
function SingleContactList({ list, isSelected, setCurrentView, allContacts }) {
  const { userData } = useContext(AuthContext);
  const [displayedContacts, setDisplayedContacts] = useState([]);
  const [visibleContacts, setVisibleContacts] = useState(8);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(allContacts) {
      setDisplayedContacts(allContacts.slice(0, visibleContacts));
    }
  }, [allContacts, visibleContacts]);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      setVisibleContacts((prevVisible) => prevVisible + 8);
    }
  };

  const handleDelete = (id) => {
    deleteContactList(id, userData?.userName);
    setCurrentView('All Contacts');
  };

  const handleUpdateList = (listKey, user, list = {}) => {
    const userLowerCase = user.toLowerCase();
    if (userLowerCase in list) {
      updateContactsInList(listKey, user, null);
    } else {
      updateContactsInList(listKey, user, true);
    }
  };

  return (
    <AccordionPanel key= { list.key }>
      <Flex direction='column' w='100%'>
        <Flex justifyContent='space-between'>
          <Flex align='center'>
            <Avatar src={ list.icon || IMAGES.hero } me='10px' />
            <Flex direction='column'>
              <Text
                fontSize='sm'
                fontWeight='bold'
                cursor='pointer'
                userSelect='none'
                letterSpacing='0.06em'
                color={ isSelected(list.title) }
                onClick={ () => {
                  setCurrentView(list.title);
                  navigate('/contacts');
                } }
              >
                {list.title}
              </Text>
            </Flex>
          </Flex>
          <Flex>
            <Menu closeOnSelect={ false }>
              <MenuButton as={ Button } bg='transparent' variant='no-effects'>
                <AddIcon fontSize='18px' fontWeight='700' />
              </MenuButton>
              <MenuList 
                onScroll={ handleScroll }
                minWidth='210px'
                h='260px' overflowY='auto' css={ {
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
                <MenuOptionGroup title='Contacts' type='checkbox' >
                  {displayedContacts && displayedContacts.map((contact) => (
                    <MenuItem key={ contact.uid } value={ contact.userName }>
                      <Checkbox                                                           
                        defaultChecked={ list.contacts && list.contacts[contact.userName.toLowerCase()] }
                        size='md'
                        onChange={ () => handleUpdateList(list.key, contact.userName, list.contacts) }
                      >
                        {contact.firstName} {contact.lastName}
                      </Checkbox>
                    </MenuItem>
                  ))}
                </MenuOptionGroup>               
              </MenuList>
            </Menu>
            <Button variant='unstyled'
              onClick= { () => setShowDeleteAlert(true) }>
              <DeleteIcon fontSize='18px' fontWeight='700'/>
            </Button>
            <ConfirmationAlert
              isOpen={ showDeleteAlert }
              onClose={  () => setShowDeleteAlert(false)  }
              onDelete={ () => handleDelete(list.key) }
              message={ 'Are you sure you want to delete this list? This action cannot be undone.' }
            />
          </Flex>
        </Flex>
      </Flex>
    </AccordionPanel>
  );
}
    
export default SingleContactList;
    
SingleContactList.propTypes = {
  list: PropTypes.object,
  isSelected: PropTypes.func,
  setCurrentView: PropTypes.func,
  allContacts: PropTypes.arrayOf(PropTypes.object),
};
    