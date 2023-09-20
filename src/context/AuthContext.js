import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  userData: null,
  setUser() { },
});

export default AuthContext;
