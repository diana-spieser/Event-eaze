import { useState, useEffect } from 'react';
import {
  Container,
  VStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { FaQuoteRight } from 'react-icons/fa';

const QuoteDisplay = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.quotable.io/random')
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.content);
        setAuthor(data.author);
      })
      .catch((error) => {
        console.error('Error fetching quote:', error);
        setError(error);
      });
  }, []);
  if (error ) {
    return (
      <Container maxW='5xl' p={ { base: 10, md: 14 } }>
        <VStack
          spacing={ 3 }
          p={ 4 }
          border='3px solid'
          borderColor='accent.primary'
          maxW='xl'
          margin='0 auto'
          boxShadow='lg'
          pos='relative'
        >
          <Icon
            as={ FaQuoteRight }
            w={ 10 }
            h={ 10 }
            color='accent.primary'
            left='-1.3rem'
            position='absolute'
            top='-1.5rem'
          />
          <Text color='white'>
              One may say the eternal mystery of the world is its
              comprehensibility.
          </Text>
          <Text
            fontWeight='bold'
            fontSize='lg'
            align='right'
            mr='3rem !important'
          >
            Albert EinStein
          </Text>
        </VStack>
      </Container>
    );
  }


  return (
    <Container maxW='5xl' p={ { base: 10, md: 14 } }>
      <VStack
        spacing={ 3 }
        p={ 4 }
        border='3px solid'
        borderColor='accent.primary'
        maxW='xl'
        margin='0 auto'
        boxShadow='lg'
        pos='relative'
      >
        <Icon
          as={ FaQuoteRight }
          w={ 10 }
          h={ 10 }
          color='accent.primary'
          left='-1.3rem'
          position='absolute'
          top='-1.5rem'
        />
        <Text color='white'>{quote}</Text>
        <Text
          fontWeight='bold'
          fontSize='lg'
          align='right'
          mr='3rem !important'
        >
          {author}
        </Text>
      </VStack>
    </Container>
  );
};

export default QuoteDisplay;
