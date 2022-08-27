import React from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Box, Tooltip, Badge, Typography, Paper, Avatar } from '@mui/material';

import MailIcon from '@mui/icons-material/Mail';
import DraftsIcon from '@mui/icons-material/Drafts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import HomeIcon from '@mui/icons-material/Home';

import LogoutIcon from '@mui/icons-material/Logout';

import { logoutUser } from '../../utils/authUser';
import StyledBadge from '../UI/StyledBadge';

const Sidebar = ({ name, username, profilePicUrl, unreadNotification, unreadMessage, email }) => {


  const { darkMode } = useSelector(state => state.utility);

  const router = useRouter();






  const badgeStyle = { cursor: 'pointer', height: 'fit-content', margin: 'auto 0.4rem' };




  return (
    <>
      <Box>
        <Paper sx={{
          m: 1,
          pr: 1,
          mt: 3,
          height: '20rem',
          position: 'fixed',
          width: { md: 'fit-content', lg: '12rem' },
          flexDirection: 'column',
          display: { xs: 'none', md: 'flex' },
          transition: 'all 300ms ease-in-out',
        }}>

          <Tooltip title='Home' arrow sx={{ my: 1, ml: 1 }}>
            <Box
              onClick={() => router.push('/')}
              sx={{
                my: 'auto',
                color: 'white',
                display: {
                  xs: 'none',
                  sm: 'flex',
                  cursor: 'pointer',
                  borderBottom: (router.pathname === '/') ? '1px solid #ef6c00' : '0',
                  pb: 1
                }
              }}>
              <Box sx={{
                display: 'flex',
                mx: 1,
              }}>
                <HomeIcon sx={{ color: (darkMode ? 'white' : 'blue') }} />
              </Box>

              <Typography sx={{
                color: darkMode ? 'white' : 'black',
                display: { md: 'none', lg: 'block' }
              }}

              >Home</Typography>
            </Box>
          </Tooltip>






          <Tooltip title='Message' arrow>
            <Box
              component='a'
              onClick={() => router.push('/messages')}
              sx={{
                color: 'white',
                my: 'auto',
                display: {
                  xs: 'none',
                  sm: 'flex',
                  borderBottom: (router.pathname === '/messages') ? '1px solid #ef6c00' : '0',
                  pb: 1
                }
              }}>
              <Box sx={{ display: 'flex', cursor: 'pointer' }} >

                {/* <Badge color={darkMode ? 'warning' : 'error'}
                  variant="dot"
                  invisible={!unreadMessage}
                  aria-label={unreadMessage}
                  sx={badgeStyle}>
                  {unreadMessage ? <DraftsIcon color='warning' /> : <MailIcon sx={{ color: darkMode ? 'white' : 'blue' }} />}
                </Badge> */}

                <Box component='span' sx={badgeStyle}>
                  <StyledBadge
                    overlap="circular"
                    color='warning'
                    invisible={!unreadMessage}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    variant="dot"
                  >
                    {unreadMessage ? <DraftsIcon color='warning' /> : <MailIcon sx={{ color: darkMode ? 'white' : 'blue' }} />}
                  </StyledBadge>
                </Box>

                <Typography sx={{
                  color: darkMode ? 'white' : 'black',
                  display: { md: 'none', lg: 'block' },
                  textAlign: 'center',
                }}>Message</Typography>

              </Box>
            </Box>
          </Tooltip>



          <Tooltip title='Notification' arrow sx={{ my: 1 }}>
            <Box
              component='a'
              onClick={() => router.push('/notifications')}
              sx={{
                my: 'auto',
                color: 'white',
                display: {
                  xs: 'none',
                  sm: 'flex',
                  borderBottom: (router.pathname === '/notifications') ? '1px solid #ef6c00' : '0',
                  pb: 1
                }
              }}>
              <Box sx={{ display: 'flex', cursor: 'pointer' }}>

                {/* <Badge color={darkMode ? 'warning' : 'error'}
                  sx={badgeStyle}
                  variant="dot"
                  invisible={!unreadNotification}
                  aria-label={unreadNotification} >

                  {unreadNotification ? <NotificationsActiveIcon color='warning' /> :
                    <NotificationsIcon sx={{ color: darkMode ? 'white' : 'blue' }} />}

                </Badge> */}


                <Box component='span' sx={badgeStyle}>


                  <StyledBadge
                    overlap="circular"
                    color='warning'
                    invisible={!unreadNotification}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    variant="dot"
                  >
                    {unreadNotification ? <NotificationsActiveIcon color='warning' /> :
                      <NotificationsIcon sx={{ color: darkMode ? 'white' : 'blue' }} />}
                  </StyledBadge>

                </Box>


                <Typography sx={{
                  color: darkMode ? 'white' : 'black',
                  display: { md: 'none', lg: 'block' }
                }} >Notifications</Typography>
              </Box>
            </Box>
          </Tooltip>

          <Tooltip title={`/${username}`} arrow sx={{ my: 1, ml: 1 }}>
            <Box
              component='a'
              onClick={() => router.push(`/${username}`)}
              sx={{
                my: 'auto',
                color: 'white',
                display: {
                  xs: 'none',
                  sm: 'flex',
                  borderBottom: (router.pathname === '/[username]') ? '1px solid #ef6c00' : '0',
                  pb: 1
                }
              }}>
              <Box sx={{ display: 'flex', cursor: 'pointer' }}>


                <Avatar alt={name} src={profilePicUrl} sizes='small' sx={{ width: '1.8rem', height: '1.8rem', mx: 1 }} />

                <Typography sx={{
                  color: darkMode ? 'white' : 'black',
                  display: { md: 'none', lg: 'block' }
                }}>Profile</Typography>
              </Box>
            </Box>
          </Tooltip>


          <Tooltip title='Logout' arrow sx={{ my: 1, ml: 1 }}>
            <Box
              onClick={() => logoutUser(email)}
              sx={{
                my: 'auto',
                color: 'white',
                display: {
                  xs: 'none',
                  sm: 'flex',
                  cursor: 'pointer'
                }
              }}>
              <Box sx={{
                display: 'flex',
                mx: 1,
              }}>
                <LogoutIcon sx={{ color: (darkMode ? 'white' : 'blue') }} />
              </Box>

              <Typography sx={{
                color: darkMode ? 'white' : 'black',
                display: { md: 'none', lg: 'block' }
              }}

              >Logout</Typography>
            </Box>
          </Tooltip>


        </Paper>
      </Box>
    </>
  )
}

export default Sidebar;