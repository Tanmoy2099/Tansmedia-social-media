import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

import { AppBar, Box, Toolbar, IconButton, Typography, Badge, MenuItem, Menu, Avatar, Tooltip } from '@mui/material';

import MailIcon from '@mui/icons-material/Mail';
import DraftsIcon from '@mui/icons-material/Drafts';

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import appName from '../../utilsServer/appName';
import { logoutUser } from '../../utils/authUser';
import baseUrl from '../../utils/baseUrl';
import { useSearchHook } from '../../custom-hook/search-hook';
import { searchActions } from '../../Store/Search-slice';

import ToggleButton from '../UI/toggleButton';
import SearchArea from './SearchArea';

import Searchbar from '../UI/Searchbar';
import { useRouter } from 'next/router';
import StyledBadge from '../UI/StyledBadge';


export default function LoggedInNavBar({ name, username, profilePicUrl, unreadNotification, unreadMessage, email }) {

  const router = useRouter();

  const dispatch = useDispatch();
  const { search, utility } = useSelector(state => state);

  const { data, text } = search;
  const { darkMode } = utility;


  const [anchorEl, setAnchorEl] = useState(null);

  const { handleChange, isLoading } = useSearchHook();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = event => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* ------------------ drop menu --------------------- */}

      <Box sx={{ display: { xs: 'flex', sm: 'flex', md: 'none', lg: 'none', xl: 'none' }, justifyContent: 'center' }}>
        <ToggleButton />
      </Box>
      <Box sx={{ display: { xs: 'flexbox', sm: 'none' } }}>
        <Link href={`/messages`}  >
          <MenuItem onClick={handleMenuClose}>Messages</MenuItem>
        </Link>
      </Box>

      <Box sx={{ display: { xs: 'flexbox', sm: 'none' } }}>
        <Link href={`/notifications`}  >
          <MenuItem onClick={handleMenuClose}>Notification</MenuItem>
        </Link>
      </Box>

      <Link href={`/${username}`}  >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      </Link>


      <MenuItem onClick={() => {
        handleMenuClose();
        logoutUser(email);
      }}>logout</MenuItem>

      {/* ------------------------------------------------------------- */}
    </Menu>
  );


  useEffect(() => {
    const url = `${baseUrl}/search/${text}`;
    handleChange(url, text);
  }, [text]);



  const badgeStyle = { cursor: 'pointer', height: 'fit-content', margin: 'auto 0.4rem' };

  const lightNav = darkMode ? { background: 'warnging' } : {}
  return <>
    <AppBar position="sticky"

      sx={{ zIndex: 10, ...lightNav }} >
      <Toolbar>
        <Tooltip title='Home' arrow>
          <Typography
            variant="h6"
            noWrap
            onClick={() => router.push('/')}
            component="div"
            sx={{
              fontSize: { xs: '1rem', sm: '1.2rem' },
              cursor: 'pointer',
              color: 'white',
              textDecoration: 'none',
              diaplay: { xs: 'none', sm: 'flex' }
            }}>

            <a>
              {appName()}
            </a>

          </Typography>


        </Tooltip>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title='Search person' arrow>
          <Box sx={{ display: { xs: 'flex' } }}>

            {/* SEARCHBAR*/}
            <Searchbar
              onBlur={() => setTimeout(() => { dispatch(searchActions.setText('')) }, [300])}
              placeholder="Search…"
              onClear={() => dispatch(searchActions.resetText())}
              value={text}
              onChange={e => dispatch(searchActions.setText(e.target.value))}
              onDropDown={text.length > 0 && <SearchArea data={data} />}
              loading={isLoading}
            />

          </Box>
        </Tooltip>

        <Box sx={{ display: 'flex' }}>

          <Tooltip title='Message' arrow>
            <Box
              component='a'
              onClick={() => router.push('/messages')}
              // href='/messages'
              sx={{
                color: 'white',
                my: 'auto',
                display: {
                  xs: 'none',
                  sm: 'flex'
                }
              }}>


              <Box component='span' sx={badgeStyle}>

                {/* <Badge color={darkMode ? 'warning' : 'error'}
                  variant="dot"
                  invisible={!unreadMessage}
                  aria-label={unreadMessage}
                  sx={badgeStyle}>
                  {unreadMessage ? <DraftsIcon sx={{ color: darkMode ? '#ffc107' : '#ffea00' }} /> : <MailIcon color='white' />}
                </Badge> */}

                <StyledBadge
                  overlap="circular"
                  color='warning'
                  invisible={!unreadMessage}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  variant="dot"
                >
                  {unreadMessage ? <DraftsIcon sx={{ color: darkMode ? '#ffc107' : '#ffea00' }} /> : <MailIcon color='white' />}
                </StyledBadge>






              </Box>
            </Box>
          </Tooltip>


          <Tooltip title='Notification' arrow >
            <Box
              component='a'
              onClick={() => router.push('/notifications')}
              sx={{
                my: 'auto',
                color: 'white',
                display: {
                  xs: 'none',
                  sm: 'flex',
                }
              }}>
              <Box component='span' sx={badgeStyle}>

                {/* <Badge color={darkMode ? 'warning' : 'error'}
                  sx={badgeStyle}
                  variant="dot"
                  invisible={!unreadNotification}
                  aria-label={unreadNotification} >
                  {unreadNotification ? <NotificationsActiveIcon sx={{ color: darkMode ? '#ffc107' : '#ffea00' }} /> : <NotificationsIcon color='white' />}
                </Badge> */}


                <StyledBadge
                  overlap="circular"
                  color='warning'
                  invisible={!unreadNotification}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  variant="dot"
                >
                  {unreadNotification ? <NotificationsActiveIcon sx={{
                    color: darkMode ? '#ffc107' : '#ffea00'
                  }} /> : <NotificationsIcon color='white' />}
                </StyledBadge>


              </Box>
            </Box>
          </Tooltip>

          <Tooltip title='Profile' arrow>
            <IconButton
              size="small"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar alt={name} src={profilePicUrl} />
            </IconButton>
          </Tooltip>

        </Box>
        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>
          <ToggleButton />
        </Box>
      </Toolbar>
    </AppBar>
    {renderMenu}

  </>;
}




