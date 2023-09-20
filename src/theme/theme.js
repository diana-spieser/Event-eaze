import '@fontsource/roboto'; // Defaults to weight 400
import '@fontsource/roboto/400.css'; // Specify weight
import '@fontsource/roboto/400-italic.css';
import { extendTheme } from '@chakra-ui/react';
import colors from './colors';

const theme = extendTheme({
  fonts: {
    body: 'Roboto',
    heading: 'Roboto',
    mono: 'Roboto',
  },
  colors,
});

export default theme;
