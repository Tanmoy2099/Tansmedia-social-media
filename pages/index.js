import { useState, useEffect, useRef } from 'react';
import axios from "axios";

import { Backdrop, Box, Container, Fab, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { parseCookies } from "nookies";
import cookie from 'js-cookie';
import InfiniteScroll from "react-infinite-scroll-component";

import baseUrl from '../utils/baseUrl';
import { PostDeleteToastr } from "../components/Layout/Toastr";
import CreatePost from '../components/Post/CreatePost';
import CardPost from '../components/Post/CardPost';
import { NoPosts } from '../components/Layout/Nodata';
import CardPostSkeleton from '../components/Post/CardPostSkeleton';
import SocketOperation from '../components/profile/SocketOperation';




const Index = ({ user, postsData = [], errorLoading }) => {

  const [posts, setPosts] = useState(postsData);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);
  const [loading, setLoading] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);


  const socket = useRef();




  useEffect(() => {
    document.title = `Welcome, ${user.name.split(' ')[0]}`;
  }, []);


  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
    return () => clearTimeout();
  }, [showToastr]);



  const fetchDataOnScroll = async () => {

    const url = `${baseUrl}/posts`;
    const header = {
      headers: { Authorization: cookie.get('token') },
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
      loader={<CardPostSkeleton />}
      endMessage={
        <Typography sx={{ textAlign: 'center' }} >No more posts</Typography>
      }
      dataLength={posts.length} >

      {posts.map(post => <Box key={post._id} sx={{ my: 1 }}>
        <CardPost post={post}
          socket={socket}
          user={user}
          loading={loading}
          setPosts={setPosts}
          setShowToastr={setShowToastr} />
      </Box>
      )}

    </InfiniteScroll>
  </>

  return (
    <>



      <Box sx={{ height: '100%', width: '100%' }}>

        {showToastr && <PostDeleteToastr />}


        <Box sx={{ display: 'relative' }}>
          <SocketOperation user={user} socket={socket}>

            {!showCreatePost && <Tooltip title='Create post' >
              <Fab color="secondary"
                sx={{
                  zIndex: 1,
                  my: 1,
                  position: { xs: 'sticky', md: 'fixed' },
                  bottom: { md: '2.8rem' },
                  left: { xs: '42%', sm: '45%', md: '1.5rem', lg: '3rem' },
                  mx: { sm: 'auto', md: 0 },
                  sizes: { sm: 'small', ms: 'medium', lg: 'large' },
                  transition: 'all 300ms ease-in-out',
                }}
                onClick={() => setShowCreatePost(true)}
                aria-label="add">
                <AddIcon />
              </Fab>
            </Tooltip>
            }


            <Backdrop open={showCreatePost} sx={{ zIndex: 15 }}>
              <Container sx={{ maxWidth: { xs: '100%', sm: '95%', md: '45rem', lg: '60%' } }}>
                <CreatePost user={user} setPosts={setPosts} setShowCreatePost={setShowCreatePost} />
              </Container>
            </Backdrop>
            {(posts?.length === 0 || errorLoading) ? <NoPosts /> :
              <Container sx={{
                my: 2,
                position: 'relative',
                right:{ sm:0 ,md:'2.5rem'},
                maxWidth: { xs: '100%', sm: '95%', md: '78%', lg: '63%', xl: '60%' },
                transition:'all 300ms ease-in-out',
              }} >
                {getAllPosts}
              </Container>
            }
          </SocketOperation>
        </Box>
      </Box>






    </>)
};

export default Index;



export const getServerSideProps = async ctx => {
  try {
    const { token } = parseCookies(ctx);
    const url = `${baseUrl}/posts`;
    const header = { headers: { Authorization: token }, params: { pageNumber: 1 } };

    const res = await axios.get(url, header);
    if (res.data.status !== 'ok') throw new Error(res.data.message);


    return { props: { postsData: res.data.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};




// Index.getInitialProps = async ctx => {

//   try {

//     const { token } = parseCookies(ctx);

//     const url = `${baseUrl}/posts`;
//     const header = { headers: { Authorization: token }, params: { pageNumber: 1 } };

//     const res = await axios.get(url, header);
//     if (res.data.status !== 'ok') throw new Error(res.data.message);

//     return { postsData: res.data.data };

//   } catch (error) {
//     return { errorLoading: true }
//   }

// }

