import {
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react';
import SidebarContent from './SideBarContent';
import Navbar  from '../Navbar/Navbar';

const SidebarWithHeader = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <SidebarContent
        onClose={ () => onClose }
        display={ { base: 'none', md: 'block' } }
      />
      <Drawer
        isOpen={ isOpen }
        placement='left'
        onClose={ onClose }
        returnFocusOnClose={ false }
        onOverlayClick={ onClose }
        size='full'
      >
        <DrawerContent>
          <SidebarContent onClose={ onClose } />
        </DrawerContent>
      </Drawer>
      <Navbar onOpen={ onOpen } />

    </>
  );
};

export default SidebarWithHeader;
