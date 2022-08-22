
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
      <Container sx={{ maxWidth: 'lg', my: 2 }} >
        <Paper >
          <Typography variant='h5' sx={{ textAlign: 'center', py: 1 }}>
            {profile.name}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: 'fit-content' }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: { xs: '100%', sm: '50%' }, maxHeight: '35rem' }}>

              <Box component='img'
                sx={{ borderRadius: '5rem', width: '85%', height: '90%', objectFit: 'cover', m: 'auto', mt: 1 }}
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
                    {/* <Box sx={{ height: '100%', weight: '100%' }}> */}
                    <CircularProgress size='100%' />
                    {/* </Box> */}
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
                email: <strong> {profile.email} </strong>
              </Typography>

              <Typography conponent='h5' sx={{ textAlign: 'left', p: 1 }}>
                username: <strong> {profile.username} </strong>
              </Typography>

              <Typography conponent='h5' sx={{ textAlign: 'left', p: 1 }}>
                about: <strong> {profile.about} </strong>
              </Typography>



            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  )
}

export default ProfileHeader;