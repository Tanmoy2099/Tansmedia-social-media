import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import { io } from 'socket.io-client';

import { Avatar, AvatarGroup, Box, Container, Divider, Fab, Paper, Tooltip, Typography } from '@mui/material';

import baseUrl, { pureBaseUrl } from '../../utils/baseUrl';
import StyledBadge from '../UI/StyledBadge';

const Friendsbar = ({ user }) => {

  const [loading, setLoading] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const socket = useRef();


  useEffect(() => {

    if (!socket.current) { socket.current = io(pureBaseUrl) }


    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('connectedUsers', ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });
    }


  }, []);



  useEffect(() => {
    const getFollowers = async () => {
      setLoading(true);

      const url = `${baseUrl}/profile/followers/${user._id}`;
      const header = { headers: { Authorization: cookie.get('token') } }
      try {
        const res = await axios.get(url, header);

        if (res.data.status !== 'ok') throw new Error(res.data.message);
        setFollowers(res.data.data);

      } catch (error) {
        console.log(error.message)
      }
      setLoading(false);
    }



    const getFollowing = async () => {
      setLoading(true);

      const url = `${baseUrl}/profile/following/${user._id}`;
      const header = { headers: { Authorization: cookie.get('token') } }
      try {
        const res = await axios.get(url, header);

        if (res.data.status !== 'ok') throw new Error(res.data.message);
        setFollowing(res.data.data);

      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
    }


    getFollowing();
    getFollowers();
  }, []);



  const followersList = followers?.map(({ user: follower }) => {

    const isOnline = connectedUsers.filter(user => user.userId === follower._id).length > 0;


    return <Tooltip title={follower.name} key={follower._id} >
      <StyledBadge
        overlap="circular"
        invisible={!isOnline}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar
          size='md'
          alt={follower.name}
          src={follower.profilePicUrl} />
      </StyledBadge>
    </Tooltip>
  });

  const followingList = following?.map(({ user: following }) => {

    const isOnline = connectedUsers.filter(user => user.userId === following._id).length > 0;

    return <Tooltip title={following.name} key={following._id} >
      <StyledBadge
        overlap="circular"
        invisible={!isOnline}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        variant="dot"
      >
      <Avatar
        size='small'
        alt={following.name}
          src={following.profilePicUrl} />
        </StyledBadge>
    </Tooltip>
});


  return (
    (followers.length > 0 || following.length > 0) && (
      <>
        <Box sx={{
          transition: 'all 300ms ease-in-out',
          // position: 'relative',
          // right: { md: '12%', lg: '12%' },
          // top: '8rem',
          display: { xs: 'none', sm: 'none', md: 'flex' },

          overflowX: 'hidden',
          position: 'absolute',
          top: '5rem',
          left: { md: '84%', lg: '79%' },
        }}>
          <Paper sx={{
            position: 'fixed', p: 1,
            width: { md: '10rem', lg: '17rem' }
          }}>

            {followers.length > 0 && <>
              <Typography sx={{ textAlign: 'center', my: 2 }} >Following you</Typography>

              <AvatarGroup max={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',

                }} > {followersList}
              </AvatarGroup>
            </>}

            {following.length > 0 && <>
              <Divider sx={{ my: 2 }} />

              <Typography sx={{ textAlign: 'center', my: 2 }} > You are following </Typography>
              <AvatarGroup max={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',

                }} > {followingList}  </AvatarGroup>
            </>}

          </Paper>
        </Box>
      </>
    )
  )
}

export default Friendsbar;