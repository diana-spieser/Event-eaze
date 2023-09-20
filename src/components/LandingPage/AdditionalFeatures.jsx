import {
  Container,
  Box,
  chakra,
  Text,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { features } from '../../common/helpers/features';

const AdditionalFeatures = () => {
  return (
    <div style={ { background: 'linear-gradient(to bottom, #4E50FB, #150A80)' } }>
      <Container maxW='6xl' p={ { base: 5, md: 10 } }>
        <chakra.h3 fontSize='4xl' fontWeight='bold' mb={ 3 } textAlign='center'>
          Our extra features
        </chakra.h3>
        <SimpleGrid
          columns={ { base: 1, md: 2 } }
          placeItems='center'
          spacing={ 16 }
          mt={ 12 }
          mb={ 4 }
        >
          {features.map((feature, index) => (
            <Box key={ index } textAlign='center'>
              <Icon
                as={ feature.icon }
                w={ 10 }
                h={ 10 }
                color='accent.primary'
                _hover={ {
                  transform: 'scale(1.3)',
                  transition: 'transform 0.2s ease', 
                } }
              />
              <chakra.h3 fontWeight='semibold' fontSize='2xl' color='white'>
                {feature.heading}
              </chakra.h3>
              <Text fontSize='md' color='white'>
                {feature.content}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </div>
  );
};

export default AdditionalFeatures;
