import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { Routes, Route } from 'react-router-dom';
import { Container, MainContent } from './components/Base/Containers';
import { onValue, query, ref, orderByChild, equalTo, onDisconnect, set, push } from 'firebase/database';
import { db } from './config/firebase-config';
import AuthContext from './context/AuthContext';
import Landing from './views/Landing/Landing';
import Dashboard from './views/Dashboard/Dashboard';
import Calendar from './views/Calendar/Calendar';
import Events from './views/Events/Events';
import SingleEvent from './views/SingleEvent/SingleEvent';
import Contacts from './views/Contacts/Contacts';
import LogIn from './views/LogIn/LogIn';
import SignUp from './views/SignUp/SignUp';
import SidebarWithHeader from './components/SideBar/SideBarWithHeader';
import About from './views/About/About';
import NotFound from './components/Base/NotFound';

function App() {
  const [user, loading] = useAuthState(auth);
  const [isInitialized, setIsInitialized] = useState(false);

  const [appState, setAppState] = useState({
    user,
    userData: null,
  });

  if (appState.user !== user) {
    setAppState({ user });
  }

  useEffect(() => {
    if (loading) return;
    setIsInitialized(true);
  }, [loading]);

  useEffect(() => {
    if (user !== null) {
      const userRef = query(ref(db, 'users'), orderByChild('uid'), equalTo(user.uid));
      const userListener = onValue(userRef, (snapshot) => {
        if (!snapshot.exists()) {
          throw new Error('Something went wrong!');
        }
        
        setAppState((prev) => ({
          ...prev,
          userData: Object.values(snapshot.val())[0],
        }));
      });

      return () => {
        userListener();
      };
    }
  }, [user]);

  useEffect(() => {
    if (user !== null && appState.userData?.userName) {
      const userName = appState.userData?.userName.toLowerCase();
      const connectedRef = ref(db, '.info/connected');
      const presenceRef = ref(db, `userStatus/${userName}`);

      const userStatusListener = onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
          const con = push(presenceRef);
          onDisconnect(con).remove();
          set(con, true);
        } 
      });

      return () => {
        userStatusListener();
      };
    }
  }, [user, appState.userData?.userName]);

  return (
    <>
      {isInitialized && (
        <AuthContext.Provider value={ { ...appState, setUser: setAppState } }>
          {user && (
            <>
              <Container>
                <SidebarWithHeader />
                <MainContent>
                  <Routes>
                    <Route index element={ <Dashboard /> } />
                    <Route path='/dashboard' element={ <Dashboard /> } />
                    <Route path='/calendar' element={ <Calendar /> } />
                    <Route path='/events' element={ <Events /> } />
                    <Route path='/events/:eventId' element={ <SingleEvent /> } />
                    <Route path='/contacts' element={ <Contacts /> } />
                    <Route path='/about' element={ <About /> } />
                    <Route path='*' element={ <NotFound /> } />
                  </Routes>
                </MainContent>
              </Container>
            </>
          )}
          {!user && (
            <>
              <Routes>
                <Route path='/' element={ <Landing /> } />
                <Route path='/login' element={ <LogIn /> } />
                <Route path='/signup' element={ <SignUp /> } />
                <Route path='*' element={ <NotFound /> } />
              </Routes>
            </>
          )}
        </AuthContext.Provider>
      )}
    </>
  );
}

export default App;
