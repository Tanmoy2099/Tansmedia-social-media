
import { useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import nProgress from 'nprogress';

import { Box, Container } from '@mui/material';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { grey } from '@mui/material/colors';

import { useSelector, useDispatch } from 'react-redux';

import Navbar from './Navbar';
import Footer from './Footer/Footer';
import LoggedInNavBar from './LoggedInNavBar';
import { utilityActions } from '../../Store/Utility-slice';
import Sidebar from '../Sidebar/Sidebar';
import Friendsbar from './Friendsbar';

const Layout = ({ children, user }) => {

  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();

  const router = useRouter();

  const dispatch = useDispatch();
  const { darkMode } = useSelector(state => state.utility);


  useEffect(() => {
    const mode = JSON.parse(localStorage.getItem("mode"));
    if (!mode) {
      dispatch(utilityActions.toggleDarkMode());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mode", JSON.stringify(darkMode));
  }, [darkMode]);


  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: grey[200],
      },
    }
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  })



  return <>
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box component='main' sx={{ transition: 'all 300ms ease-in-out' }}>
        {user ? <>
          <LoggedInNavBar {...user} />

          <Box sx={{
            display: 'flex',
            minHeight: '40rem',
            position: 'relative',
            width: '100%',
            transition: 'all 300ms ease-in-out',
          }}>

            {/* left sidebar */}
            {(router?.pathname !== '/messages') && <Sidebar {...user} />}

              {children}

            {/* right sidebar */}
            {((router?.pathname !== '/messages')) && <Friendsbar user={user} />}
          </Box>

        </> : <>

          <Box component='main' sx={{ transition: 'all 300ms ease-in-out' }}>
            <Navbar />
            <Box component='main' sx={{ minHeight: '65vh' }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </>}
      </Box>
    </ThemeProvider>
  </>
}

export default Layout;