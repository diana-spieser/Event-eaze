import { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Stack,
  Image,
  Grid,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { BiBeenHere } from 'react-icons/bi';
import { APIKey } from '../../common/external-api-constants';
import IMAGES from '../../assets/images/Images';

const city = 'Sofia';

const WeatherCard = () => {
  const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDay = new Date().getDay();

  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${city}&days=3`
    )
      .then((response) => response.json())
      .then((data) => {
        setForecastData(data);
        setWeatherData(data);
      })
      .catch((error) => {
        console.error('Error fetching forecast data:', error);
      });
  }, []);

  return (
    <VStack spacing={ 2 } textAlign='center'>
      <Stack>
        {weatherData ? (
          <Flex
            direction='column'
            alignItems='center'
            justify={ 'center' }
            alignSelf={ { base: 'center', lg: 'flex-start' } }
            borderRadius={ 'xl' }
            pt={ 4 }
            pl={ 4 }
          >
            <Grid templateColumns='repeat(2, 1fr)' gap={ 6 }>
              <Flex direction={ 'column' } align={ 'center' }>
                <Image src={ IMAGES.weather } alt='Weather Icon' />
                <Flex align={ 'center' } justify={ 'center' } ml={ '1' } mt={ '-10' }>
                  <Icon as={ BiBeenHere } mr={ 1 } color='white'/>
                  <Text fontSize='xl' fontWeight='bold' color='white'>
                    {weatherData.location.name}
                  </Text>
                </Flex>
              </Flex>

              <Flex direction='column' alignItems='center' justify={ 'center' }>
                <Text fontSize='xl' fontWeight='bold' color='white'>
                  Today
                </Text>
                <Text fontSize='3xl' fontWeight='bold' mb={ -4 } color='white'>
                  {Math.round(weatherData.current.temp_c)}°C
                </Text>

                {weatherData.current.condition.icon && (
                  <Image
                    src={ weatherData.current.condition.icon }
                    alt='Weather Icon'
                  />
                )}
              </Flex>
            </Grid>
          </Flex>
        ) : (
          <div>Loading current weather...</div>
        )}

        {forecastData ? (
          <>
            <Grid templateColumns='repeat(2, 1fr)' gap={ 6 }>
              {forecastData.forecast.forecastday.slice(1).map((day, index) => (
                <Flex
                  key={ index }
                  direction={ 'column' }
                  alignSelf={ { base: 'center', lg: 'flex-start' } }
                  borderRadius={ 'xl' }
                  p={ 4 }
                  align={ 'center' }
                >
                  <Text fontWeight='bold' color='white'>
                    {WEEK_DAYS[(currentDay + index + 1) % 7]}
                  </Text>
                  <Text color='white'>{Math.round(day.day.avgtemp_c)}°C</Text>
                  <Text color='white'>
                    {new Date(day.date).toLocaleDateString()}{' '}
                  </Text>
                  {day.day.condition.icon && (
                    <Image src={ day.day.condition.icon } alt='Weather Icon' />
                  )}
                </Flex>
              ))}
            </Grid>
          </>
        ) : (
          <div>Loading forecast...</div>
        )}
      </Stack>
    </VStack>
  );
};

export default WeatherCard;
