import { useState, useEffect } from 'react'
import Link from 'next/link';
import cookie from 'js-cookie';
import axios from 'axios';

import { ListItem, ListItemText, Typography, Divider, Box, Paper, Button, ListItemAvatar, Avatar } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';


import baseUrl from '../../utils/baseUrl';
import { NoFollowData } from '../Layout/Nodata';
import Loader from '../Layout/CustomLoader/Loader';
import { followUser, unfollowUser } from '../../utils/profileActions';

const Following = ({ user, loggedUserFollowStats, setUserFollowStats, profileUserId }) => {

  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);


  useEffect(() => {
    const getFollowing = async () => {
      setLoading(true);

      const url = `${baseUrl}/profile/following/${profileUserId}`;
      const header = { headers: { Authorization: cookie.get('token') } }
      try {
        const res = await axios.get(url, header);

        if (res.data.status !== 'ok') throw new Error(res.data.message);
        setFollowing(res.data.data);

      } catch (error) {
        alert(error.message)
      }
      setLoading(false);
    }

    getFollowing();
  }, []);


  const handleFollowing = (isFollowing, person) => {
    setFollowLoading(true);
    isFollowing ? unfollowUser(person._id, setUserFollowStats) : followUser(person._id, setUserFollowStats)
    setFollowLoading(false);
  }


  let displayFollowing = following.map(({ user: person }) => {


    const fling = loggedUserFollowStats.following;
    const isFollowing = fling.length > 0 && fling.filter(samePerson => samePerson.user === person._id).length > 0;


    return <Paper key={person._id} sx={{ minWidth: { xs: '100%', md: '49%' }, px: 0 }}>
      <ListItem sx={{ width: '100%' }}>
        <Link href={'/' + person.username}>
          <>
            <ListItemAvatar sx={{ cursor: 'pointer' }}>
              <Avatar alt={person.name} src={person.profilePicUrl} />
            </ListItemAvatar>
            <ListItemText
              sx={{ cursor: 'pointer' }}
              primary={person.name}
              secondary={<>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                >
                  {person.username}
                </Typography>
              </>}
            />
          </>
        </Link>
        <Box sx={{ flexGrow: 1 }} />

        {person._id !== user._id && (

          <Button variant={isFollowing ? 'contained' : 'outlined'}
            startIcon={!followLoading && (isFollowing ? <TaskAltIcon sx={{ mr: 0.5 }} /> : <PersonAddAltIcon sx={{ mr: 0.5 }} />)}
            sx={{ my: 'auto', textTransform: 'none' }}
            onClick={() => handleFollowing(isFollowing, person)}
            disabled={followLoading}>

            {followLoading ? <Loader /> : (
              <Typography sx={{ display: { xs: 'none', sm: 'flex' } }}>
                {isFollowing ? 'Following' : 'Follow'}
              </Typography>
            )}
          </Button>

        )}
      </ListItem>
      {/* <Divider /> */}
    </Paper>

  });

  return loading ? <Loader /> : (following.length > 0 ? <>
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }} >
      {displayFollowing}
    </Box>
  </> : <NoFollowData FollowingComponent={true} />)
}

export default Following;