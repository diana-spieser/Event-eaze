import {
  Button,
  Box,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import { FaGlobe, FaCalendar } from 'react-icons/fa';
import { AiOutlineEye } from 'react-icons/ai';
import { BiCategoryAlt } from 'react-icons/bi';
import EventsCategory from './EventsCategory';
import PropTypes from 'prop-types';

function EventControls({
  switchToAllEvents,
  switchToMyEvents,
  switchToPublicEvents,
  isAdmin,
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  eventCountsByCategory,
  currentEventSource,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box gap={ 3 } align='center' p={ 2 }>
      {isAdmin && (
        <Button
          size='sm'
          fontSize={ 14 }
          variant={ activeTab === 'allEvents' ? 'solid' : 'outline' }
          leftIcon={ <AiOutlineEye /> }
          onClick={ () => {
            switchToAllEvents();
            setActiveTab('allEvents');
          } }
          mt={ 1 }
        >
          All
        </Button>
      )}
      <Button
        size='sm'
        fontSize={ 14 }
        variant={ activeTab === 'myEvents' ? 'solid' : 'outline' }
        leftIcon={ <FaCalendar /> }
        onClick={ () => {
          switchToMyEvents();
          setActiveTab('myEvents');
        } }
        ml={ 1 }
        mt={ 1 }
      >
        My Events
      </Button>

      <Button
        size='sm'
        fontSize={ 14 }
        variant={ activeTab === 'publicEvents' ? 'solid' : 'outline' }
        leftIcon={ <FaGlobe /> }
        onClick={ () => {
          switchToPublicEvents();
          setActiveTab('publicEvents');
        } }
        ml={ 1 }
        mt={ 1 }
      >
          Public
      </Button>
      <Button
        size='sm'
        fontSize={ 14 }
        variant={ activeTab === 'publicEvents' ? 'solid' : 'outline' }
        leftIcon={ <BiCategoryAlt /> }
        onClick={ onOpen }
        ml={ 1 }
        mt={ 1 }
      >
          Categories
      </Button>


      <Drawer placement='right' isOpen={ isOpen } onClose={ onClose } size='xs'>
        <DrawerOverlay />
        <DrawerContent maxW={ '375px' }>
          <DrawerHeader>Filter By Category</DrawerHeader>
          <DrawerBody>
            <EventsCategory
              selectedCategory={ selectedCategory }
              setSelectedCategory={ setSelectedCategory }
              onClose={ onClose }
              eventCountsByCategory={ eventCountsByCategory }
              currentEventSource={ currentEventSource }
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default EventControls;
EventControls.propTypes = {
  switchToAllEvents: PropTypes.func,
  switchToMyEvents: PropTypes.func,
  switchToPublicEvents: PropTypes.func,
  isAdmin: PropTypes.bool,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
  selectedCategory: PropTypes.string,
  setSelectedCategory: PropTypes.func,
  eventCountsByCategory: PropTypes.object,
  currentEventSource: PropTypes.string,
};
