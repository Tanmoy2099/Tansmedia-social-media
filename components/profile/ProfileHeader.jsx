
import { useState } from 'react'

import { Container, Paper, Typography, Box, Button, CircularProgress } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { followUser, unfollowUser } from '../../utils/profileActions';



const ProfileHeader = ({ profile, ownAccount, loggedUserFollowStats, setUserFollowStats }) => {

  const [loading, setLoading] = useState(false);

  const isFollowing = loggedUserFollowStats.following.length > 0 && loggedUserFollowStats.following.filter(following => following.user === profile._id).length > 0;


  const handleFollow = async () => {
    setLoading(true)
    isFollowing ? await unfollowUser(profile._id, setUserFollowStats) : await followUser(profile._id, setUserFollowStats)
    setLoading(false)
  }


  return (
    <>
      <Container sx={{ width: 'fit-content', my: 2 }}>
        <Paper elevation={2}>
          <Typography variant='h5' sx={{ textAlign: 'center', py: 1, height: {} }}>
            {profile.name}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: 'fit-content', px: 'auto' }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'fit-content', maxHeight: '35rem', m:'auto' }}>

              <Box component='img'
                sx={{ borderRadius: '5px', width: '15rem', height: '17rem', objectFit: 'fill', m: 1 }}
                draggable='false'
                src={profile.profilePicUrl} alt='profile pic' />

              {!ownAccount && (
                <Button variant={`${isFollowing ? 'contained' : 'outlined'}`}
                  onClick={handleFollow}
                  disabled={loading}
                  sx={{
                    width: '90%',
                    my: 1,
                    mx: 'auto',
                    textTransform: 'none'
                  }}>
                  {loading ? <>
                    <CircularProgress size='100%' />
                  </> : (
                    isFollowing ? <>
                      <TaskAltIcon sx={{ mr: 0.5 }} /> {'Following'}
                    </> : <>
                      <PersonAddAltIcon sx={{ mr: 0.5 }} /> {'Follow'} </>
                  )}
                </Button>)
              }

            </Box>

            <Box sx={{ width: { xs: '100%', sm: '50%' } }}>

              <Typography conponent='h4' sx={{ textAlign: 'left', p: 1, }}>
                Email: <strong> {profile.email} </strong>
              </Typography>

              <Typography conponent='h5' sx={{ textAlign: 'left', p: 1 }}>
                Username: <strong> {profile.username} </strong>
              </Typography>

              <Typography conponent='h5' sx={{ textAlign: 'left', p: 1 }}>
                About: <strong> {profile.about} </strong>
              </Typography>



            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  )
}

export default ProfileHeader;