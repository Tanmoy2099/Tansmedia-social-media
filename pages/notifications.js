import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';
import { Box, Container, Paper } from '@mui/material';

import baseUrl from '../utils/baseUrl';
import { NoNotifications } from '../components/Layout/Nodata';

import { useDispatch } from 'react-redux';

import LikeNotification from '../components/Notifications/LikeNotification';
import CommentNotification from '../components/Notifications/CommentNotification';
import FollowerNotification from '../components/Notifications/FollowerNotification';

import { utilityActions } from '../Store/Utility-slice';


const Notifications = ({ notifications, errorLoading, user, userFollowStats }) => {

  if (errorLoading) {
    return <NoNotifications />;
  }

  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(utilityActions.setNotification(notifications))
  }, [notifications]);

  useEffect(() => {

    const url = `${baseUrl}/notifications`;
    const token = cookie.get('token')
    const header = { headers: { Authorization: token } };

    setTimeout(() => {
      (async () => {
        try {
          const res = await axios.post(url, {}, header)
          if (res.data.status !== 'ok') throw new Error(res.data.message)
        } catch (error) {
          console.log(error.message);
        }
      })()
    }, 300);

    return () => {
      clearTimeout();
    }

  }, []);





  return (
    <>
      <Container sx={{ mt: '1.5rem', px: { xs: 0 }, maxWidth: { xs: '100%', sm: '95%', md: '45rem', lg: '60%' } }}>
        {notifications?.length === 0 ? <NoNotifications /> : <>
          <>
            <Box sx={{ minHeight: '40rem', overflow: 'auto', position: 'relative', width: '100%' }}>

              <Box>
                {notifications.map(notification => (
                  <Box key={notification._id}>
                    {notification.type === "newLike" && notification.post !== null && <LikeNotification notification={notification} />}

                    {notification.type === "newComment" &&
                      notification.post !== null && <CommentNotification notification={notification} />}

                    {notification?.type === "newFollower" && (
                      <FollowerNotification
                        notification={notification}
                        loggedUserFollowStats={loggedUserFollowStats}
                        setUserFollowStats={setUserFollowStats}
                      />
                    )}
                  </Box>
                ))}
              </Box>

            </Box>
          </>
        </>}
      </Container>
    </>
  )
}

export default Notifications;





Notifications.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);

  const url = `${baseUrl}/notifications`;
  const header = { headers: { Authorization: token } };
  try {

    const res = await axios.get(url, header);
    if (res.data.status !== 'ok') throw new Error(res.data.message);

    return { notifications: res.data.data }

  } catch (error) {
    return { errorLoading: true }
  }
}