import { useState, useEffect } from 'react'
import Link from 'next/link';
import cookie from 'js-cookie';
import axios from 'axios';

import { ListItem, ListItemText, Typography, Divider, Box, Paper, Button, ListItemAvatar, Avatar } from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import baseUrl from '../../utils/baseUrl';
import { NoFollowData } from '../Layout/Nodata';
import { followUser, unfollowUser } from '../../utils/profileActions';
import Loader from '../Layout/CustomLoader/Loader';
import { useRouter } from 'next/router';


const Followers = ({ user, loggedUserFollowStats, setUserFollowStats, profileUserId, setActiveItem }) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);


  useEffect(() => {
    const getFollowers = async () => {
      setLoading(true);

      const url = `${baseUrl}/profile/followers/${profileUserId}`;
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

    getFollowers();
  }, []);


  const handleFollower = (isFollowing, person) => {
    setFollowLoading(true);
    isFollowing ? unfollowUser(person._id, setUserFollowStats) : followUser(person._id, setUserFollowStats)
    setFollowLoading(false);
  }



  let displayFollowers = followers.map(({ user: person }) => {


    const fl = loggedUserFollowStats.following;
    const isFollowing = fl.length > 0 && fl.some(following => following.user === person._id);

    return <Paper key={person._id} sx={{ minWidth: { xs: '100%', md: '49%' }, px: 0, maxWidth: '25rem', my: 1, mr: 0.5 }}>
      <ListItem sx={{ width: '100%' }}>
        <Box onClick={() => {
          router.push(`/${person.username}`);
          setActiveItem('profile');
        }}>
          <a style={{ display: 'flex' }}>
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
          </a>
        </Box>
        <Box sx={{ flexGrow: 1 }} />

        {person._id !== user._id && (

          <Button variant={isFollowing ? 'contained' : 'outlined'}
            onClick={() => handleFollower(isFollowing, person)}
            startIcon={!followLoading && (isFollowing ? <TaskAltIcon sx={{ mr: 0.5 }} /> : <PersonAddAltIcon sx={{ mr: 0.5 }} />)}
            sx={{ my: 'auto', textTransform: 'none' }}
            disabled={followLoading}>

            {followLoading ? <Loader /> : (
              <Typography sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                {isFollowing ? 'Following' : 'Follow'}
              </Typography>
            )}
          </Button>
        )}
      </ListItem>
      <Divider />
    </Paper>

  });

  return loading ? <Loader /> : (followers.length > 0 ? <>
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      width: '90%',
      mx: 'auto',
    }} >
      {displayFollowers}
    </Box>
  </> : <NoFollowData followersComponent={true} />)
}

export default Followers;