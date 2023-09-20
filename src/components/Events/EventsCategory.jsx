import { Button, Container, Stack, Wrap, WrapItem } from '@chakra-ui/react';
import {
  getIconByCategory,
  eventCategories,
} from '../../common/helpers/EventHelpers';
import PropTypes from 'prop-types';

function EventsCategory({
  setSelectedCategory,
  onClose,
  eventCountsByCategory,
}) {
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onClose();
  };



  const getColorScheme = (count) => {
    if (count === 0) {
      return 'gray';
    } else if (count <= 1) {
      return 'green';
    } else if (count < 3) {
      return 'blue';
    } else {
      return 'purple';
    }
  };

  const sortedCategories = eventCategories.sort(
    (a, b) => (eventCountsByCategory[b] || 0) - (eventCountsByCategory[a] || 0)
  );

  return (
    <Container as={ Stack } maxW={ '6xl' } py={ 10 }>
      <Stack direction='column'>
        <Wrap spacing={ 4 }>
          {sortedCategories.map((category, index) => (
            <WrapItem key={ index }>
              <Button
                colorScheme={ getColorScheme(
                  eventCountsByCategory[category] || 0
                ) }
                leftIcon={ getIconByCategory(category) }
                onClick={ () => handleCategoryClick(category) }
              >
                {category} ({eventCountsByCategory[category] || 0})
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </Stack>
    </Container>
  );
}

export default EventsCategory;

EventsCategory.propTypes = {
  setSelectedCategory: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  eventCountsByCategory: PropTypes.object,
  currentEventSource: PropTypes.string,
};
