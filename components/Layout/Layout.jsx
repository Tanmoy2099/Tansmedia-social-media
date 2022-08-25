
import { useEffect } from 'react';
import Router from 'next/router';
import nProgress from 'nprogress';

import { Box } from '@mui/material';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { grey } from '@mui/material/colors';

import { useSelector, useDispatch } from 'react-redux';

import Navbar from './Navbar';
import Footer from './Footer/Footer';
import LoggedInNavBar from './LoggedInNavBar';
import { utilityActions } from '../../Store/Utility-slice';

const Layout = ({ children, user }) => {

  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();

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
            minHeight: '40rem',
            position: 'relative',
            maxWidth: '100%',
            transition: 'all 300ms ease-in-out'
          }}>
            {children}
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