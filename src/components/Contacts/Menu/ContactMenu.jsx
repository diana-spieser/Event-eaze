import { CardContainer } from '../../Base/Containers';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, Text, } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import CreateContactList from './CreateContactList';
import MenuLists from './MenuLists';
import colors from '../../../theme/colors';
import PropTypes from 'prop-types';

function ContactMenu({ currentView, setCurrentView, contactLists, allContacts, isSearching }) {
  const defaultOpenPanels = [0];
 
  return (
    <CardContainer>
      <Accordion allowMultiple width='100%' maxW='lg' rounded='lg' defaultIndex={ defaultOpenPanels }>
        <Text fontSize='lg' textAlign={ 'center' } fontWeight={ 'bold' } p={ 4 }>
          Menu
        </Text>
        <MenuLists 
          currentView={ currentView }
          setCurrentView= { setCurrentView }
          contactLists={ contactLists }
          allContacts={ allContacts }
          isSearching = { isSearching }
        />
        <AccordionItem>
          <AccordionButton
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            p={ 4 }
            _hover={ { bg: colors.accent.primary } }
            borderRadius={ 'md' }
          >
            <Text fontSize='md'>Create New</Text>
            <AddIcon fontSize='14px' />
          </AccordionButton>
          <AccordionPanel pb={ 4 }>
            <CreateContactList />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </CardContainer>
  );
}

export default ContactMenu;

ContactMenu.propTypes = {
  currentView: PropTypes.string,
  setCurrentView: PropTypes.func,
  contactLists: PropTypes.arrayOf(PropTypes.object),
  allContacts: PropTypes.arrayOf(PropTypes.object),
  isSearching: PropTypes.bool
};
