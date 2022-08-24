import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import appName from '../../utilsServer/appName';


import ToggleButton from '../UI/toggleButton';

const Navbar = () => {

  const router = useRouter();

  const isActive = route => router.pathname === route;

  const navDecor = { color: 'white', fontSize: '1.2rem', textDecoration: 'none', cursor: 'pointer', padding: '1rem 0.5rem' }
  const activeCSS = { borderRadius: '0.5rem', borderBottom: '2px solid white' }


  return <>
    <AppBar position='static'>
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        <Link href='/' >
          <Typography variant='h5' sx={{ color: 'white', textDecoration: 'none', cursor: 'pointer' }}>
            {appName()}
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction='row' spacing={2}>
          <Link href='/login' >
            <Typography sx={isActive('/login') ? { ...activeCSS, ...navDecor } : navDecor}>
              Login
            </Typography>
          </Link>
          <Link href='/signup' >
            <Typography sx={isActive('/signup') ? { ...activeCSS, ...navDecor } : navDecor} >
              signup
            </Typography>
          </Link>

          <Box >
            <ToggleButton />
          </Box>
        </Stack>

      </Toolbar>
    </AppBar>
  </>
}

export default Navbar;