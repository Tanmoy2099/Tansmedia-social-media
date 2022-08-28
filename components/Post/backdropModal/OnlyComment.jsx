import { useState } from 'react';

import Link from 'next/link';

import { Avatar, Box, CardContent, ListItem, ListItemAvatar, ListItemText, Typography, Card, Paper } from '@mui/material';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import PostComments from '../PostComments';
import { likePost, deletePost } from '../../../utils/postActions';

import calculateTime from '../../../utils/calculateTime';
import CommentInputfield from '../CommentInputField';
import LikesList from '../LikesList';


const OnlyComment = ({ post, user, setLikes, likes, isLiked, comments, setComments }) => {


  const [anchor, setAnchor] = useState(null);


  return (
    <>
      {/* <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr', md: '1fr 1fr', lg: '1fr 1fr' }, height: '100%', width: '100%', paddingBottom: { sm: '2rem' } }}> */}


      <Card sx={{
        display: 'grid',
        gridColumn: '1fr, 1fr, 1fr, 6fr, 2fr',
        width: { xs: '95vw', sm: '80vw', md: '60vw' },
        height: { xs: '70vh' },
        transition: 'all 400ms ease-in-out',
        position: 'relative'
      }}>
        {/* Name */}
        <CardContent sx={{
          display: 'flex', m: 0,
          position: 'relative',
          overFlow: 'auto',
          py: 1,
          px: 0.5
        }} >
          <Link href={`/${post.user.username}`} >
            <Box sx={{ display: { sm: 'flex', md: 'block' } }}>

              <ListItem alignItems="flex-start" >
                <ListItemAvatar>
                  <Avatar alt="profile pic" src={post.user.profilePicUrl} />
                </ListItemAvatar>
                <ListItemText

                  primary={
                    <Typography

                      component="span"
                      variant="body1"
                      color="text.primary"
                    >
                      {post.user.name}
                    </Typography>
                  }

                  secondary={
                    <>
                      <Typography

                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {calculateTime(post.createdAt)}
                      </Typography>

                      {post.location && <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {post.location}
                      </Typography>}
                    </>
                  }
                />
              </ListItem>
            </Box>
          </Link>

          {/* Post likes */}
          <Box sx={{
            m: 1,
            display: 'flex',
            position: 'absolute',
            width: 'fit-content',
            fontSize: '0.8rem',
            bottom: 10,
            right: 10
          }}>

            <Box component='span'
              onClick={() => likePost(post._id, user._id, setLikes, isLiked ? false : true)}
              sx={{
                cursor: 'pointer',
              }} >
              {isLiked ? <FavoriteIcon color='error'
                sx={{
                  height: '1.4rem',
                  width: '1.4rem'
                }}

              /> : <FavoriteBorderIcon sx={{
                cursor: 'pointer',
                height: '1.4rem',
                width: '1.4rem'
              }} color='error' />}
            </Box>

            {(likes.length > 0) && (
              <>
                <LikesList postId={post._id} likes={likes} />
              </>
            )}
          </Box>

        </CardContent>

        {/* Post */}
        <ListItemText sx={{
          overflow: 'auto',
          display: 'flex',
          width: '100%',
          maxHeight: '5rem'
        }}>
          <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.9rem', ml: 1.5 }} >
            <strong>Post: </strong> {post.text}
          </Typography>


        </ListItemText>

        {/* Comment */}
        <Typography variant='p' sx={{ fontSize: 12, ml: 1.5 }}>
          Comments: {comments.length > 0 ? `${comments.length} total` : 'No comment'}
        </Typography>
        {(comments.length > 0) ? (
          <Box sx={{
            overflow: 'auto',
          }}>
            {comments.map(comment => (
              <PostComments
                key={comment._id}
                comment={comment}
                postId={post._id}
                user={user}
                setComments={setComments}

              />
            ))}

          </Box>) : (
          <Paper sx={{ height: '3rem'}}>
            <Typography variant="body1"
              sx={{ textAlign: 'center', color: 'black' }}
              color="initial">
              Be the First person to Comment
            </Typography>
          </Paper>
        )}

        {/* Create post */}
        <Box sx={{
          width: '100%',
        }}>
          <CommentInputfield
            user={user}
            postId={post._id}
            setComments={setComments} />
        </Box>

      </Card>


      {/* </Box> */}
    </>
  )
}

export default OnlyComment;