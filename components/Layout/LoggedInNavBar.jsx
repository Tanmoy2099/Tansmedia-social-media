import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';

import { AppBar, Box, Toolbar, IconButton, Typography, Badge, MenuItem, Menu, Avatar, Tooltip } from '@mui/material';

import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';

import appName from '../appName';
import { logoutUser } from '../../utils/authUser';
import baseUrl from '../../utils/baseUrl';
import { useSearchHook } from '../../custom-hook/search-hook';
import { searchActions } from '../../Store/Search-slice';

import ToggleButton from '../UI/toggleButton';
import SearchArea from './SearchArea';

import Searchbar from '../UI/Searchbar';


export default function LoggedInNavBar({ name, username, profilePicUrl, unreadNotification, unreadMessage, email }) {

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

      <Box sx={{ display: { xs: 'flex', md: 'none', sm: 'none', xs: 'none' }, justifyContent: 'center' }}>
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

      <Link href='/account' >
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
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


  return <>
    {/* <Box sx={{ flexGrow: 1, zIndex: 10 }}> */}
    <AppBar position="sticky" sx={{ zIndex: 10 }}>
      <Toolbar>
        <Link href='/' >
          <Tooltip title='Home' arrow>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontSize: { xs: '1rem', sm: '1.2rem' },
                cursor: 'pointer'
              }}>

              {appName()}

            </Typography>
          </Tooltip>
        </Link>

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
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex',
                  // color: 'action.active'
                }
              }}>
              <Link href='/messages' >

                <Badge color="secondary"
                  variant="dot"
                  invisible={!unreadMessage}
                  aria-label={unreadMessage}
                  sx={badgeStyle}>
                  <MailIcon color={unreadMessage ? 'warning' : ''} />
                </Badge>

              </Link>
            </Box>
          </Tooltip>
          <Tooltip title='Notification' arrow>
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex',
                  // color: 'action.active'
                }
              }}>
              <Link href='/notifications' >
                <Badge color="secondary"
                  sx={badgeStyle}
                  variant="dot"
                  invisible={!unreadNotification}
                  aria-label={unreadNotification} >
                  <NotificationsIcon
                    color={unreadNotification ? 'warning' : ''} />
                </Badge>
              </Link>
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
    {/* </Box> */}

  </>;
}




