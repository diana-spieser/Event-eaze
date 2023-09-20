import { v4 as uuidv4 } from 'uuid';
import { Button, FormLabel, FormControl, Input, Box, Flex, HStack, Tag, TagLabel, Menu,
  MenuButton, MenuList, MenuOptionGroup, MenuItem, Checkbox, MenuDivider, TagRightIcon,
  Popover, PopoverTrigger, PopoverBody, PopoverCloseButton, PopoverContent, PopoverArrow, } from '@chakra-ui/react';
import { AddIcon, SettingsIcon } from '@chakra-ui/icons';
import { useContext, useEffect, useState, useRef } from 'react';
import { getContactListsByUser } from '../../../../services/contacts.service';
import AuthContext from '../../../../context/AuthContext';
import PropTypes from 'prop-types';
import colors from '../../../../theme/colors';
  
function ManageParticipants({ participants, setParticipants, editors, setEditors }) {
  const { userData } = useContext(AuthContext);  
  const [contactLists, setContactLists] = useState([]);
  const [filteredLists, setFilteredLists] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState(userData?.contacts && Object.keys(userData?.contacts));
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null);
  
  useEffect(() => {
    getContactListsByUser(userData?.userName)
      .then(snapshot => {
        if (snapshot.exists() ) {  
          const nonEmptyLists = Object.values(snapshot.val())
            .filter(list => list.contacts);
          setContactLists(nonEmptyLists);
          setFilteredLists(nonEmptyLists);
        }
      })
      .catch(e => console.error('Error getting contact lists', e));
  }, [userData?.userName]);

  const handleUpdateList = (contact, type, listContacts) => {
    const updatedParticipants = { ...participants };
    const updatedEditors = { ...editors };

    if (updatedParticipants[contact]) {
      delete updatedParticipants[contact];

      if (updatedEditors[contact]) {
        delete updatedEditors[contact]; 
        setEditors(updatedEditors);       
      }

    } else {
      updatedParticipants[contact] = type === 'contact' ? true : listContacts;
    }

    setParticipants(updatedParticipants);  
  };

  const handleAddEditor = (participant, type) => {
    const updatedEditors = { ...editors };

    if (updatedEditors[participant]) {
      delete updatedEditors[participant];
    } else {
      updatedEditors[participant] = type === 'object' ? participants[participant] : true;
    }

    setEditors(updatedEditors);
  };
  
  const handleFilter = () => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  
    debounceTimeout.current = setTimeout(() => {
      const query = inputRef.current.value;
      const filteredContacts = Object.keys(userData?.contacts)
        .filter(
          contact => contact.toLowerCase().includes(query.toLowerCase())
        );
  
      const filteredLists = Object.values(contactLists).filter((list) =>
        list.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContacts(filteredContacts);
      setFilteredLists(filteredLists);
    }, 500);
  }; 
  
  return (  
    <FormControl mt={ 4 }>
      <HStack>
        <Menu closeOnSelect={ false }>
          <MenuButton as={ Button } bg='transparent' variant='no-effects'>
            <Flex alignItems='center'>
              <FormLabel>Manage Participants</FormLabel>
              <Box
                mb={ 2 }
                w={ 22 }
                h={ 22 }
                bg={ colors.accent.primary }
                borderRadius={ 'full' }
                display={ 'flex' }
                alignItems={ 'center' }
                justifyContent={ 'center' }
              >
                <AddIcon fontSize='14px' fontWeight='700' color='white' />
              </Box>          
            </Flex>  
          </MenuButton>
          <MenuList 
            minWidth='210px'
            h='260px' 
            overflowY='auto' 
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
            <Input placeholder='Search' ref={ inputRef } onChange={ handleFilter } />
            <MenuOptionGroup title='Contact Lists' type='checkbox' >
              {filteredLists.length > 0 && filteredLists.map(list => (
                <MenuItem key={ list.key } value={ list.title }>
                  <Checkbox                                                           
                    defaultChecked={ participants && participants[list.title] }
                    size='md'
                    onChange={ () => handleUpdateList(list.title, 'list', list.contacts) }
                  >
                    {list.title}
                  </Checkbox>
                </MenuItem>            
              ))}               
              <MenuDivider />  
            </MenuOptionGroup> 
            <MenuOptionGroup title='Contacts' type='checkbox'>
              {userData?.contacts && filteredContacts.map((contact) => (
                <MenuItem key={ contact } value={ contact }>
                  <Checkbox                                                           
                    defaultChecked={ participants && participants[contact] }
                    size='md'
                    onChange={ () => handleUpdateList(contact, 'contact') }
                  >
                    {contact}
                  </Checkbox>
                </MenuItem>
              ))}            
            </MenuOptionGroup> 
          </MenuList>
        </Menu>
      </HStack>
      <Box maxH={ '65px' } overflowY={ 'auto' } 
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
        {Object.keys(participants).map(participant => (
          <Tag key={ uuidv4() } m='1' 
            bg={ typeof participants[participant] === 'object' ? colors.light.accent : colors.light.primary } >
            <TagLabel color='white'>{participant}</TagLabel>
            <Popover>
              <PopoverTrigger>
                <TagRightIcon as={ SettingsIcon } color={ 'white' } cursor={ 'pointer' } />
              </PopoverTrigger>
              <PopoverContent  w={ '110%' }>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody> 
                  <Checkbox colorScheme='green'                   
                    defaultChecked={ editors[participant] }
                    onChange={ () => handleAddEditor(participant, typeof participants[participant]) }
                  >
                  Give editing permissions?
                  </Checkbox> 
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Tag>
        ))}
      </Box>
    </FormControl>    
  );
}

export default ManageParticipants;

ManageParticipants.propTypes = {
  participants: PropTypes.object,
  setParticipants: PropTypes.func,
  editors: PropTypes.object,
  setEditors: PropTypes.func,
};
