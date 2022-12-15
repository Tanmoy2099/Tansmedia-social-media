import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AppBar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';

import MoreIcon from '@mui/icons-material/MoreVert';

import appName from '../../utilsServer/appName';
import ToggleButton from '../UI/toggleButton';

const Navbar = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const isActive = route => router.pathname === route;

  const navDecor = { color: 'white', fontSize: '1.2rem', textDecoration: 'none', cursor: 'pointer', padding: '1rem 0.5rem' }
  const activeCSS = { borderRadius: '0.5rem', borderBottom: '2px solid white' }

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = event => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={ anchorEl }
      anchorOrigin={ {
        vertical: 'top',
        horizontal: 'right',
      } }
      id={ menuId }
      keepMounted
      transformOrigin={ {
        vertical: 'top',
        horizontal: 'right',
      } }
      open={ isMenuOpen }
      onClose={ handleMenuClose }
    >
      {/* ------------------ drop menu --------------------- */ }

      <Box sx={ { display: { xs: 'flex', sm: 'flex', md: 'none', lg: 'none', xl: 'none' }, justifyContent: 'center' } }>
        <ToggleButton />
      </Box>
      <Box sx={ { display: { xs: 'flexbox' } } }>
        <Link href={ `/login` }  >
          <MenuItem onClick={ handleMenuClose }>Login</MenuItem>
        </Link>
      </Box>

      <Box sx={ { display: { xs: 'flexbox' } } }>
        <Link href={ `/signup` }  >
          <MenuItem onClick={ handleMenuClose }>Signup</MenuItem>
        </Link>
      </Box>


      {/* ------------------------------------------------------------- */ }
    </Menu>
  );




  return <>
    <AppBar position='static'>
      <Toolbar sx={ { display: 'flex', alignItems: 'center' } }>

        <Typography variant='h5' sx={ { color: 'white', textDecoration: 'none', cursor: 'pointer' } }>
          { appName() }
        </Typography>

        <Box sx={ { flexGrow: 1 } } />
        <Stack direction='row' spacing={ 2 } sx={ { display: { xs: 'none', sm: 'none', md: 'flex' } } }>
          <Link href='/login' >
            <Typography sx={ isActive('/login') ? { ...activeCSS, ...navDecor } : navDecor }>
              Login
            </Typography>
          </Link>
          <Link href='/signup' >
            <Typography sx={ isActive('/signup') ? { ...activeCSS, ...navDecor } : navDecor } >
              signup
            </Typography>
          </Link>

          <Box >
            <ToggleButton />
          </Box>
        </Stack>

        <IconButton
          size="large"
          aria-label="display more actions"
          edge="end"
          color="inherit"
          sx={ { display: { xs: 'flex', sm: 'flex', md: 'none', lg: 'none', xl: 'none' } } }
          onClick={ handleProfileMenuOpen }
        >
          <MoreIcon />
        </IconButton>


        { renderMenu }


      </Toolbar>
    </AppBar>
  </>
}

export default Navbar;