import { useState } from 'react'
import Link from 'next/link';
import { Avatar, Box, Button, Card, Paper, CardHeader, CircularProgress, Divider, Typography } from '@mui/material';

import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

import calculateTime from '../../utils/calculateTime';
import { followUser, unfollowUser } from '../../utils/profileActions';

import { useSelector } from "react-redux";





const FollowerNotification = ({ notification, loggedUserFollowStats, setUserFollowStats }) => {
  const { darkMode } = useSelector(state => state.utility);

  const [loading, setLoading] = useState(false);

  const followingUser = loggedUserFollowStats.following;


  const isFollowing = followingUser.length > 0 && followingUser.filter(following => following.user === notification.user._id).length > 0;


  const linkColor = { color: darkMode ? '#fbc02d' : '#3f51b5' };
  const linkStyle = { cursor: 'pointer', '&:hover': { fontStyle: 'italic' } };
  const linkTypography = (value, sx) => <Typography component='span' variant='body2' sx={sx}> {value}</Typography>


  const handleFollow = async () => {
    setLoading(true)
    isFollowing ? await unfollowUser(notification.user._id, setUserFollowStats) : await followUser(notification.user._id, setUserFollowStats)
    setLoading(false)
  }




  return (
    <Paper sx={{ display: 'flex', mb:1  }}>
      <Divider />
      <Card sx={{ width: '100%', height: 'fit-content', fontSize: '1.2rem', display:'flex' }}>

        <CardHeader
          avatar={<Avatar src={notification.user.profilePicUrl} />}
          title={<>
            <Link href={`/${notification.user.username}`}>{linkTypography(notification.user.name, { color: 'primary', ...linkColor, ...linkStyle })}
            </Link>
            {linkTypography('started following you.')}
          </>}
          subheader={linkTypography(calculateTime(notification.date))}
        />
      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ width: 'fit-content', my: 'auto', mr: 0.5 }}>
        <Button variant={`${isFollowing ? 'contained' : 'outlined'}`}
          disabled={loading}
          onClick={handleFollow}
          sx={{ width: 'fit-content', my: 0.1, mx: 'auto', textTransform: 'none' }}>
          {loading ? <CircularProgress size='small' /> : (
            isFollowing ? <>
              <TaskAltIcon sx={{ mr: 0.5 }} /> <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>Following</Box>
            </> : <>
              <PersonAddAltIcon sx={{ mr: 0.5 }} />
              <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>Follow</Box>
            </>
          )}
        </Button>
      </Box>

      </Card>
    </Paper>
  )
}

export default FollowerNotification;