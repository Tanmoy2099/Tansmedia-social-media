import { useState, useEffect } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import { Avatar, AvatarGroup, Box, Container, Divider, Fab, Paper, Tooltip, Typography } from '@mui/material';

import baseUrl from '../../utils/baseUrl';

const Friendsbar = ({ user }) => {

  const [loading, setLoading] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);


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



  const followersList = followers?.map(({ user: follower }) => (
    <Tooltip title={follower.name} key={follower._id} >
      <Avatar
        size='md'
        alt={follower.name}
        src={follower.profilePicUrl} />
    </Tooltip>
  ));

  const followingList = following?.map(({ user: following }) => (
    <Tooltip title={following.name} key={following._id} >
      <Avatar
        size='md'
        alt={following.name}
        src={following.profilePicUrl} />
    </Tooltip>
  ));


  return (
    (followers.length > 0 || following.length > 0) && (
      <>
        <Box sx={{
          position: 'absolute',
          right: { md: '12%', lg: '11%' },
          top: '8rem',
          display: { xs: 'none', sm: 'none', md: 'flex' },
        }}>
          <Paper sx={{ position: 'fixed', p: 1, width: { md: '8rem', lg: '11rem' } }}>

            {followers.length > 0 && <> <Typography sx={{ textAlign: 'center', my: 2 }} >Following you</Typography>

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