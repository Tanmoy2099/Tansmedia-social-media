
import { useState } from 'react';
// import Link from 'next/link';

import { useRouter } from 'next/router';

import {
  Avatar, Box, Button, CardContent, CardMedia, IconButton, ListItem,
  ListItemAvatar, ListItemText, Popover, Typography, Divider, Backdrop, Paper, Skeleton
} from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
import ForwardIcon from '@mui/icons-material/Forward';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import LikesList from './LikesList';
import ImageModal from "./backdropModal/ImageModal";
import OnlyComment from "./backdropModal/OnlyComment";
import PostComments from './PostComments';
import CommentInputField from './CommentInputField';
import SnackBarMsg from '../UI/SnackBarMsg';
import calculateTime from '../../utils/calculateTime';
import { likePost, deletePost } from '../../utils/postActions';


const CardPost = ({ post, user, setPosts, setShowToastr, loading, socket }) => {

  const router = useRouter();

  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const initialMsg = { hasMsg: false, type: '', message: '' }
  const [msg, setMsg] = useState(initialMsg);
  const [anchor, setAnchor] = useState(null);


  const isLiked = likes.length > 0 && likes.filter(like => like.user === user._id).length > 0;

  const ShowModal = ({ modalBoolean, setModalBoolean, Modal, setOtherModal }) => {

    let flipButtonStyle = showPhotoModal ? {
      left: { xs: '27vw', sm: '37vw', lg: '40vw' }
    } : {
      right: { xs: '35vw', sm: '32vw', md: '23vw', lg: '24.5vw' }
    }

    const closeButton = () => {
      setModalBoolean(false)
      setOtherModal(false)
    };

    const flipButton = () => {
      setModalBoolean(false)
      setOtherModal(true)
    };



    return <>
      <SnackBarMsg msg={msg} setMsg={setMsg} />
      <Backdrop
        sx={{
          color: '#222',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: 'all 300ms ease-in-out'
        }}
        open={modalBoolean}
      >
        <Paper sx={{
          padding: 1,
          width: 'fit-content',
          height: 'fit-content',
          position: 'relative'
        }}>
          <>
            <Modal
              post={post}
              user={user}
              likes={likes}
              isLiked={isLiked}
              comments={comments}
              setLikes={setLikes}
              setComments={setComments}
              setOtherModal={setOtherModal}
            />
          </>

          {/* Close Button */}
          <IconButton
            onClick={closeButton}
            sx={{
              position: 'absolute',
              bottom: -25,
              right: '47%',
              bgcolor: 'white',
              padding: 0.1
            }} >
            <CancelIcon sx={{
              height: { xs: '2.5rem', xl: '3rem' },
              width: { xs: '2.5rem', xl: '3rem' },
              color: '#1e88e5',
              '&:hover': {
                color: '#1e9ee5',
                bgcolor: '#eee',
                borderRadius: '50%'
              }
            }} />
          </IconButton>


          {/* Image Button */}
          {/* {post.picUrl && */}
          <IconButton
            onClick={flipButton}
            sx={{
              ...flipButtonStyle,
              border: '1px solid #1e88e5',
              position: 'absolute',
              bottom: { xs: -20, sm: -25 },
              bgcolor: 'white',
              padding: 0.1
            }}>

            <ForwardIcon sx={{
              transform: `${showPhotoModal ? 'rotate(0deg)' : 'rotate(180deg)'}`,
              height: { sm: '2rem', md: '2.5rem' },
              width: { sm: '2rem', md: '2.5rem' },

              color: '#1e88e5',
              '&:hover': {
                color: '#1e9ee5',
                bgcolor: '#eee',
                borderRadius: '50%'
              }
            }} />
          </IconButton>
          {/* } */}

        </Paper>
      </Backdrop>
    </>
  }



  return (
    <>
      <ShowModal modalBoolean={showPhotoModal} setModalBoolean={setShowPhotoModal} Modal={ImageModal} setOtherModal={setShowCommentModal} />
      <ShowModal modalBoolean={showCommentModal} setModalBoolean={setShowCommentModal} Modal={OnlyComment} setOtherModal={setShowPhotoModal} />

      {/* <Container sx={{
        my: 2,
        maxWidth: { xs: '100%', sm: '95%', md: '45rem', lg: '60%' }
      }} > */}
        <Paper>
          {
            !post.picUrl ? <Skeleton variant="rectangular" width='10rem' height='100%' /> :
              (post.picUrl && <CardMedia component='img'
                alt='img post'
                src={post.picUrl}
                draggable='false'
                sx={{ cursor: 'pointer' }}
                onClick={() => setShowPhotoModal(true)}
              />
              )
          }
          <CardContent sx={{ display: 'flex' }} >
            <a onClick={() => router.push(`/${post.user.username}`)} >

              <ListItem alignItems="flex-start" sx={{ cursor: 'pointer', width: 'fit-content', cursor: 'pointer' }}>
                {!post.user.profilePicUrl && loading ? <Skeleton variant="circular" width={40} height={40} /> : <ListItemAvatar>
                  <Avatar alt="profile pic" src={post.user.profilePicUrl} />
                </ListItemAvatar>}

                {!post.user.name && loading ? <Skeleton variant="text" sx={{ width: '6rem', mx: 1, fontSize: '1rem' }}

                /> : <ListItemText
                  sx={{ width: 'fit-content', maxWidth: '10rem' }}
                  primary={post.user.name}
                  secondary={
                    <>
                      {!post.createdAt && loading ? <Skeleton variant="text" sx={{ width: '6rem', mx: 1, fontSize: '1.2rem' }} /> : <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        
                        {calculateTime(post.createdAt)}
                      </Typography>}

                      {!post.location && loading ? <Skeleton variant="text" sx={{ width: '6rem', mx: 1, fontSize: '1rem' }} /> : (post.location && <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {post.location}
                      </Typography>
                      )}
                    </>
                  }
                />}
              </ListItem>
            </a>
            <Box sx={{ flexGrow: 1 }} />

            {(user.role === 'root' || post.user._id === user._id) && (
              <>
                <IconButton aria-label="delete"
                  onClick={(e) => setAnchor(e.currentTarget)}
                  sx={{ height: 'fit-content', my: 'auto' }}>
                  <DeleteOutlineIcon />
                </IconButton>

                <Popover
                  open={Boolean(anchor)}
                  anchorEl={anchor}
                  anchorOrigin={{
                    vertical: 'center',
                    horizontal: 'left'
                  }}
                  transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right'
                  }}
                  onClose={() => setAnchor(null)}
                >
                  <Box sx={{
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Typography component='p' >This action is Irreversible</Typography>
                    <Button variant='contained'
                      color='error'
                      size="small"
                      sx={{ my: 1, mx: 'auto' }}
                      onClick={() => deletePost(post._id, setPosts, setShowToastr, setMsg)}
                    >Delete</Button>
                  </Box>
                </Popover>

              </>
            )}

          </CardContent>

          <Divider display='hidden' />

          <CardContent>
          {!post.text ? <Skeleton variant="text" sx={{ width: '100%', mx: 1, fontSize: '1.3rem' }} /> : <Paper elevation1='true' sx={{p:1}}>
            <h5>Post:</h5>
              <Typography variant="body2" color="text.primary" sx={{ mx: { lg: 3, md: 2, xs: 1 } }}>
                {post.text}
              </Typography>
            </Paper>}
          </CardContent>

          <Divider display='hidden' />


          <Box sx={{ display: 'flex', m: 1, width: 'fit-content' }}>

            {/* Post likes */}
            <Box component='span'
              onClick={() => {

                if (socket.current) {
                  socket.current.emit('likePost', {
                    postId: post._id,
                    userId: user._id,
                    like: isLiked ? false : true
                  });

                  socket.current.on('postLiked', () => {
                    if (isLiked) {
                      setLikes(prev => prev.filter(like => like.user !== user._id));
                    } else {
                      setLikes(prev => [...prev, { user: user._id }]);
                    }
                  })

                } else {
                  likePost(post._id, user._id, setLikes, setMsg, isLiked ? false : true)
                }
              }}
              sx={{ cursor: 'pointer' }} >
              {isLiked ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon sx={{ cursor: 'pointer' }} color='error' />}
            </Box>

            {(likes.length > 0) && (
              <>
                <LikesList postId={post._id} likes={likes} />
              </>
            )}
          </Box>

          <Typography variant='p' sx={{ fontSize: 12, ml: 1.5 }}>Comments: {comments.length > 0 ? `${comments.length} total` : 'No comment'} </Typography>
          {
    !post._id ? <Skeleton variant="rectangular" sx={{ width: '100%', height: { xs: '10rem', sm: '20rem', lg: '30rem' } }} /> : ((comments?.length > 0) && <CardContent>
      {comments.map((comment, i) => i < 3 && (
        <PostComments
          key={comment._id}
          comment={comment}
          postId={post._id}
          user={user}
          setComments={setComments}

        />
      ))}
    </CardContent>
    )
  }

  {
    comments.length > 3 && (
      <Button variant='outlined' sx={{ color: 'teal', mx: 2, mb: 2 }}
        onClick={() => setShowCommentModal(true)}
        size='small'>View more</Button>
    )
  }
  {
    !post._id ? <Skeleton variant="rectangular" sx={{ width: '100%', height: '4rem' }} /> : <CommentInputField
      user={user}
      postId={post._id}
      socket={socket}
      setComments={setComments} />
  }
        </Paper >
  {/* </Container> */ }


    </>
  )
}

export default CardPost;