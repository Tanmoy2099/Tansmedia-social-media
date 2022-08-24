import { useState, useEffect, useRef } from 'react';
import axios from "axios";
import io from 'socket.io-client';

import { Backdrop, Box, Container, Divider, Fab, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { parseCookies } from "nookies";
import InfiniteScroll from "react-infinite-scroll-component";
import cookie from 'js-cookie';

import baseUrl, { pureBaseUrl } from '../utils/baseUrl';
import { PostDeleteToastr } from "../components/Layout/Toastr";
import CreatePost from '../components/Post/CreatePost';
import CardPost from '../components/Post/CardPost';
import { NoPosts } from '../components/Layout/Nodata';
import Loader from '../components/Layout/CustomLoader/Loader';
import getUserInfo from '../utils/getUserInfo';
import MessageNotificationModel from '../components/Home/MessageNotificationModel';

import newMsgSound from '../utils/newMsgSound';
import NotificationPortal from '../components/Home/NotificationPortal';


const Index = ({ user, postsData, errorLoading }) => {

  // convert it to useReducer
  const [posts, setPosts] = useState(postsData);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const [loading, setLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModel, setNewMessageModel] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [notificationPopup, setNotificationPopup] = useState(false);


  const socket = useRef();




  useEffect(() => {

    if (!socket.current) {
      socket.current = io(pureBaseUrl)
    }

    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePicUrl: profilePicUrl
          });
          setNewMessageModel(true);
        }

        newMsgSound(name);

      });
    }

    document.title = `Welcome, ${user.name.split(' ')[0]}`;

  }, []);


  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
    return () => clearTimeout();
  }, [showToastr]);


  useEffect(() => {
    if (socket.current) {
      socket.current.on('newLikeNotificationReceived', ({ name, profilePicUrl, username, postId }) => {
        setNewNotification({ name, profilePicUrl, username, postId, type: 'like' });

        setNotificationPopup(true);
      })
    }
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('newCommentNotificatioReceived', ({ name, profilePicUrl, username, postId, commentingUserId }) => {

        if (user._id !== commentingUserId) {
          setNewNotification({ name, profilePicUrl, username, postId, type: 'comment' });

          setNotificationPopup(true);
        }
      })
    }
  }, []);
















  

  const fetchDataOnScroll = async () => {

    const token = cookie.get('token');
    const url = `${baseUrl}/posts`;
    const header = {
      headers: { Authorization: token },
      params: { pageNumber }
    };

    setLoading(true);
    try {
      const res = await axios.get(url, header);
      if (res.data.total === 0) setHasMore(false)

      setPosts(prev => [...prev, ...res.data.data]);
      setPageNumber(prev => prev + 1);

    } catch (error) {
      console.log('Error fetching posts')
    }
    setLoading(false);
  }


  const getAllPosts = <>
    <InfiniteScroll hasMore={hasMore}
      next={fetchDataOnScroll}
      loader={<Loader />}
      endMessage={
        <Typography sx={{ textAlign: 'center' }} >No more posts</Typography>
      }
      dataLength={posts.length} >

      {posts.map(post => <Box key={post._id} >
        <CardPost post={post}
          socket={socket}
          user={user}
          loading={loading}
          setPosts={setPosts}
          setShowToastr={setShowToastr} />
        <Divider sx={{ my: 1 }} />
      </Box>
      )}

    </InfiniteScroll>
  </>

  return <Box sx={{ height: '100%', width: '100%' }}>

    {showToastr && <PostDeleteToastr />}


    {newNotification !== null && (

      <Tooltip title='Notification' >
        <NotificationPortal
          newNotification={newNotification}
          notificationPopup={notificationPopup}
          setNotificationPopup={setNotificationPopup}
        />
      </Tooltip>

    )}


    <Box sx={{ display: 'relative' }}>

      {newMessageModel && newMessageReceived !== null && (
        <MessageNotificationModel
          socket={socket}
          showNewMessageModel={setNewMessageModel}
          newMessageModel={newMessageModel}
          user={user}
        />
      )}

      {/* <Box> */}
      {!showCreatePost && <Tooltip title='Create post' >
        <Fab color="secondary"
          sx={{
            zIndex: 1,
            my: 1,
            position: { xs: 'sticky', md: 'fixed' }, bottom: { md: '2.8rem' },
            left: { xs: '42%', sm: '45%', md: '2rem', lg: '3rem' },
            mx: { sm: 'auto', md: 0 },
            sizes: { sm: 'small', ms: 'medium', lg: 'large' }
          }}
          onClick={() => setShowCreatePost(true)}
          aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      }
      {/* </Box> */}


      <Backdrop open={showCreatePost} sx={{ zIndex: 10 }}>
        <Container sx={{ maxWidth: { xs: '100%', sm: '95%', md: '45rem', lg: '60%' } }}>
          <CreatePost user={user} setPosts={setPosts} setShowCreatePost={setShowCreatePost} />
        </Container>
      </Backdrop>
      {(posts?.length === 0 || errorLoading) ? <NoPosts /> : getAllPosts}
    </Box>
  </Box>
};

export default Index;


Index.getInitialProps = async ctx => {

  try {

    const { token } = parseCookies(ctx);

    const url = `${baseUrl}/posts`;
    const header = { headers: { Authorization: token }, params: { pageNumber: 1 } };

    const res = await axios.get(url, header);
    if (res.data.status !== 'ok') throw new Error(res.data.message);

    return { postsData: res.data.data };

  } catch (error) {
    return { errorLoading: true }
  }

}