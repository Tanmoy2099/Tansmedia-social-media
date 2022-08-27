import React from 'react'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { Box, Tooltip, Badge, Typography, Paper, Avatar } from '@mui/material';

import MailIcon from '@mui/icons-material/Mail';
import DraftsIcon from '@mui/icons-material/Drafts';

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import LogoutIcon from '@mui/icons-material/Logout';

import { logoutUser } from '../../utils/authUser';

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

        }}>

          <Tooltip title='Message' arrow>
            <Box
              component='a'
              onClick={() => router.push('/messages')}
              sx={{
                color: 'white',
                my: 'auto',
                display: {
                  xs: 'none',
                  sm: 'flex'
                }
              }}>
              <Box sx={{ display: 'flex', cursor: 'pointer' }} >

                <Badge color={darkMode ? 'warning' : 'error'}
                  variant="dot"
                  invisible={!unreadMessage}
                  aria-label={unreadMessage}
                  sx={badgeStyle}>
                  {unreadMessage ? <DraftsIcon color='warning' /> : <MailIcon sx={{ color: darkMode ? 'white' : 'blue' }} />}


                </Badge>

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
                }
              }}>
              <Box sx={{ display: 'flex', cursor: 'pointer' }}>

                <Badge color={darkMode ? 'warning' : 'error'}
                  sx={badgeStyle}
                  variant="dot"
                  invisible={!unreadNotification}
                  aria-label={unreadNotification} >

                  {unreadNotification ? <NotificationsActiveIcon color='warning' /> :
                    <NotificationsIcon sx={{ color: darkMode ? 'white' : 'blue' }} />}


                </Badge>
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
              sx={{
                my: 'auto',
                color: 'white',
                display: {
                  xs: 'none',
                  sm: 'flex',
                }
              }}>
              <Box sx={{
                display: 'flex',
                cursor: 'pointer',
                mx: 1,
              }}>
                <LogoutIcon sx={{ color: (darkMode ? 'white' : 'blue') }} />
              </Box>

              <Typography sx={{
                color: darkMode ? 'white' : 'black',
                display: { md: 'none', lg: 'block' }
              }}
                onClick={() => logoutUser(email)}
              >Logout</Typography>
            </Box>
          </Tooltip>


        </Paper>
      </Box>
    </>
  )
}

export default Sidebar;