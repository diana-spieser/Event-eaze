import { useEffect, useState } from 'react';
import {
  Input,
  InputGroup,
  Button,
  useColorModeValue,
  InputLeftElement,
  InputRightAddon,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

function SearchBar({ onSearch, clearSearch, currentView }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    setSearchQuery('');
  }, [clearSearch, currentView]);

  const inputBorderColor = useColorModeValue('gray.200', 'gray.500');
  return (
    <InputGroup
      borderRadius={ 'lg' }
      size='md'
      boxShadow='0px 5px 14px rgba(0, 0, 0, 0.05)'
      maxW='310px'
      mr={ 4 }
    >
      {' '}
      <InputLeftElement
        pointerEvents='none'
        // eslint-disable-next-line react/no-children-prop
        children={ <Search2Icon color='gray.600' /> }
      />
      <Input
        type='text'
        placeholder='Search...'
        value={ searchQuery }
        onChange={ (e) => setSearchQuery(e.target.value) }
        onKeyUp={ handleKeyPress }
        border='1px solid'
        borderColor={ inputBorderColor }
        borderRadius='lg'
        _focus={ {
          borderColor: '#FF4500',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        } }
      />
      <InputRightAddon p={ 0 } border='none'>
        <Button
          size='md'
          borderLeftRadius={ 0 }
          onClick={ handleSearch }
          color={ 'white' }
          borderColor={ inputBorderColor }
          _hover={ { bg: '#3700B3' } }
          bg='accent.primary'
          cursor='pointer'
        >
          Search
        </Button>
      </InputRightAddon>
    </InputGroup>
  );
}

SearchBar.propTypes = {
  onSearch: PropTypes.func,
  clearSearch: PropTypes.bool,
  currentView: PropTypes.string,
};

export default SearchBar;
