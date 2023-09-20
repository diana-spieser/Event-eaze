import { FormLabel, FormControl, Input, List, ListItem, HStack, Switch, useColorModeValue, } from '@chakra-ui/react';
import { useState } from 'react';
import { MAPBOX_API_KEY } from '../../../../common/external-api-constants';
import { fetchAddressSuggestions } from '../../../../common/helpers/mapboxAdressHelpers';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';

mapboxgl.accessToken = MAPBOX_API_KEY;

function Address({ setLongitude, setLatitude, address, setAddress, isOnline, setIsOnline }) {
  const [suggestions, setSuggestions] = useState([]);
  const [selectSuggestion, setSelectSuggestion] = useState('');
  const bgColor = useColorModeValue('#fffffe', '#1A202C');

  const handleAddressChange = (query) => {
    setAddress(query);

    const accessToken = mapboxgl.accessToken;
    fetchAddressSuggestions(query, accessToken)
      .then((suggestions) => {
        setSuggestions(suggestions.suggestions);
        const { latitude, longitude } = suggestions;
        setLatitude(latitude);
        setLongitude(longitude);
      })
      .catch((error) => {
        console.error('Error fetching address suggestions:', error);
      });
  };

  const handleSuggestionSelect = (suggestion) => {
    setSelectSuggestion(suggestion);  
    setAddress(suggestion);
    setSuggestions([]);
  };

  const handleSetIsOnline = (e) => { 
    setIsOnline(e.target.checked); 
    setAddress('');
    setLatitude(0);
    setLongitude(0);
    setSuggestions([]);
  };

  return (
    <FormControl isRequired mt={ 2 }>
      <HStack>
        <FormLabel>Address</FormLabel>
        <FormControl>
          <Switch
            onChange={ (e) => handleSetIsOnline(e) }
            colorScheme={ 'orange' }
            mb={ 2 }
            defaultChecked={ isOnline }
          >
              Online
          </Switch>
        </FormControl>
      </HStack>
      <Input
        type={ 'text' }
        autoComplete={ 'shipping address-line1' }
        value={ address }
        onChange={ (e) => handleAddressChange(e.target.value) }
        placeholder={ 'Enter address' }
        disabled={ isOnline }
        w={ '100%' }
      />
      <List spacing={ 2 }
        position={ 'absolute' }
        zIndex={ 1 }
        width={ '100%' }
        backgroundColor={ bgColor }
        borderRight={ '1px solid lightBlue' }
        borderLeft={ '1px solid lightBlue' }
      >
        {suggestions.map((suggestion, index) => (
          <ListItem
            key={ index }
            onClick={ () => handleSuggestionSelect(suggestion) }
            cursor='pointer'
            _hover={ { bgColor: 'blue.100' } }
          >
            {suggestion}
          </ListItem>
        ))}
      </List>
    </FormControl>
  );
}

export default Address;

Address.propTypes = {
  setLongitude: PropTypes.func,
  setLatitude: PropTypes.func,
  address: PropTypes.string,
  setAddress: PropTypes.func,
  isOnline: PropTypes.bool,
  setIsOnline: PropTypes.func,
};
