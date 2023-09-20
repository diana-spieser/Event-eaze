import { mode } from '@chakra-ui/theme-tools';

const styles = {
  global: (props) => ({
    body: {
      backgroundColor: mode('#fffffe')(props),
      margin: 0,
      overflow: 'hidden',
    },
  }),
};

export default styles;
