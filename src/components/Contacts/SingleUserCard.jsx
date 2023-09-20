import { getUserByHandle } from '../../services/user.service';
import { updateUserData } from '../../services/user.service';
import { addContact, removeContact, updateContactsInList } from '../../services/contacts.service';
import { Tr, Td, Avatar, AvatarBadge, Text, Flex, Button, } from '@chakra-ui/react';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';
import { useContext, useState, useEffect } from 'react';
import ConfirmationAlert from '../Base/ConfirmationAlert';
import AuthContext from '../../context/AuthContext';
import colors from '../../theme/colors';
import PropTypes from 'prop-types';

function SingleUserCard({ user, userOnline, contactLists }) {
  const { userData } = useContext(AuthContext);
  const [isBlocked, setIsBlocked] = useState(!user.isBlocked);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    getUserByHandle(user.userName)
      .then(snapshot => snapshot.exists() ? setIsBlocked(!snapshot.val().isBlocked) : null)
      .catch(e => console.error(e));
  }, [isBlocked, user.userName]);

  const isInContacts = (contactName) => {
    if (userData.contacts) {
      const contactSet = new Set(Object.keys(userData.contacts));
      return contactSet.has(contactName.toLowerCase());   
    }
    return false;
  };

  const handleAddContact = (user) => {
    addContact(userData?.userName, user);
  };

  const handleRemoveContact = (user) => {
    removeContact(userData?.userName, user);
    contactLists.forEach(list => updateContactsInList(list.key, user.toLowerCase(), null));
  };

  const handleConfirmBlock = () => {
    const userName = user.userName.toLowerCase();
    setIsBlocked(prevState => !prevState);
    updateUserData(userName, 'isBlocked', isBlocked);
    setIsConfirmationOpen(false);
  };
  
  return (
    <Tr key={ user }
      display={ {
        base: 'grid',
        md: 'table-row',
      } }
      sx={ {
        '@media print': {
          display: 'table-row',
        },
        gridTemplateColumns: 'minmax(0px, 15%) minmax(0px, 75%)',
        gridGap: '100px',
      } }>
      <Td minWidth={ { sm: '250px' } }>
        <Flex
          align='center'
          py='.8rem'
          minWidth='100%'
          flexWrap={ { base: 'wrap', md: 'nowrap' } }
        >
          <Flex align='center' w={ '100%' } direction={ 'row' } mb={ 1 }>
            <Flex>
              <Avatar
                src={ user.photoUrl || '#' }
                size={ 'md' }
                me='12px'
                borderRadius={ '50%' }
              >
                <AvatarBadge boxSize='1em' bg={ userOnline(user.userName) ? 'green' : 'grey' } />
              </Avatar>
            </Flex>
            <Flex direction='column'>
              <Text fontSize='sm' fontWeight='bold' minWidth='100%'>
                {`${user.firstName} ${user.lastName}`}
              </Text>
              <Text
                fontSize='sm'
                color='gray.400'
                fontWeight='normal'
              >
                {user.email}
              </Text>
              <Text
                fontSize='sm'
                fontWeight='normal'
                color={ colors.accent.primary }
              >
            @{user.userName}
              </Text>
            </Flex>
          </Flex>
          <Flex direction={ { base: 'row', md: 'column' } }>
            {(!isInContacts(user.userName) && user.userName !== userData?.userName) ? 
              (<Button mb={ 1 } mr={ 1 }
                size={ 'sm' }  w={ '100px' }
                onClick={ () => handleAddContact(user.userName) }
                bg={ colors.accent.primary }
                color={ 'white' }
              > 
                <FaUserPlus />
                <Text ml={ 1 }>Add</Text>
              </Button>) : 
              user.userName !== userData?.userName && (
                <Button size={ 'sm' }  w={ '100px' } mb={ 1 } mr={ 1 }
                  onClick={ () => handleRemoveContact(user.userName) }> 
                  <FaUserMinus /> 
                  <Text ml={ 1 }>Remove</Text>
                </Button>)}
            {(userData?.role === 'Admin' && user.userName !== userData?.userName) && (
              <Button size={ 'sm' } bg={ isBlocked ? colors.accent.primary : null } color={ 'white' }  w={ '100px' }
                onClick={ () => setIsConfirmationOpen(true) }> 
                {isBlocked ?  'Block' : 'Unblock' }
              </Button>)}
            <ConfirmationAlert
              isOpen={ isConfirmationOpen }
              onClose={ () => setIsConfirmationOpen(false) }
              onDelete={ handleConfirmBlock }
              message={ `Are you sure you want to ${isBlocked ? 'block' : 'unblock'} this user?` }
            />
          </Flex>
        </Flex>
      </Td>
    </Tr>          
  );
}

SingleUserCard.propTypes = {
  user: PropTypes.object,
  userOnline: PropTypes.func,
  contactLists: PropTypes.arrayOf(PropTypes.object),
};

export default SingleUserCard;
