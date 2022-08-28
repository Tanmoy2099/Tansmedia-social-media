import { useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import Link from "next/link";

import {
  Avatar, Box, Card, CardContent, CardMedia, ListItem,
  ListItemAvatar, ListItemText, Typography, Divider, Skeleton, Container
} from '@mui/material';


import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


import PostComments from "../../components/Post/PostComments";
import CommentInputField from "../../components/Post/CommentInputField";
import LikesList from "../../components/Post/LikesList";

import calculateTime from '../../utils/calculateTime';
import baseUrl from "../../utils/baseUrl";
import { NoPostFound } from "../../components/Layout/NoData";
import { likePost } from "../../utils/postActions";

const PostPage = ({ post, errorLoading, user }) => {


  const [likes, setLikes] = useState(post?.likes);
  const [comments, setComments] = useState(post?.comments);
  const [loading, setLoading] = useState(false);

  const isLiked = likes?.length > 0 && likes.filter(like => like?.user === user?._id).length > 0;


  return (

    errorLoading ? <><NoPostFound />
    </> : <Container>
      <Card sx={{ m: 2 }}>
        {
          !post?.picUrl ? <Skeleton variant="rectangular" width='10rem' height='100%' /> :
            (post?.picUrl && <CardMedia component='img'
              alt='img post'
              src={post?.picUrl}
              draggable='false'
              sx={{ cursor: 'pointer' }}
              onClick={() => setShowPhotoModal(true)}
            />
            )
        }
        <CardContent sx={{ display: 'flex' }} >
          <Link href={`/${post?.user.username}`} >
            <ListItem alignItems="flex-start" sx={{ cursor: 'pointer', width: 'fit-content' }}>
              {
                !post?.user.profilePicUrl && loading ? <Skeleton variant="circular" width={40} height={40}
                /> : <ListItemAvatar>
                  <Avatar alt="profile pic" src={post?.user.profilePicUrl} size='large' />
                </ListItemAvatar>}

              {!post?.user.name && loading ? <Skeleton variant="text" sx={{ width: '6rem', mx: 1, fontSize: '1rem' }}

              /> : <ListItemText
                sx={{ width: 'fit-content', maxWidth: '10rem' }}
                primary={post?.user.name}
                secondary={
                  <>
                    {!post?.createdAt && loading ? <Skeleton variant="text" sx={{ width: '6rem', mx: 1, fontSize: '1.2rem' }} /> : <Typography
                      sx={{ display: 'block' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {calculateTime(post?.createdAt)}
                    </Typography>}

                    {!post?.location && loading ? <Skeleton variant="text" sx={{ width: '6rem', mx: 1, fontSize: '1rem' }} /> : (post?.location && <Typography
                      sx={{ display: 'block' }}
                      component="span"
                      variant="body2"
                      color="text.primary" >

                      {post?.location}
                    </Typography>
                    )}
                  </>
                }
              />}
            </ListItem>
          </Link>

        </CardContent>

        <Divider />

        <CardContent>
          {!post?.text && loading ? <Skeleton variant="text" sx={{ width: '100%', mx: 1, fontSize: '1.3rem' }} /> : <><h5>Post:</h5>
            <Typography variant="body2" color="text.primary" sx={{ mx: { lg: 3, md: 2, xs: 1 } }}>
              {post?.text}
            </Typography></>}
        </CardContent>

        <Divider />


        <Box sx={{ display: 'flex', m: 1, width: 'fit-content' }}>

          {/* Post likes */}
          <Box component='span'
            onClick={() => likePost(post._id, user._id, setLikes, setMsg, isLiked ? false : true)}
            sx={{ cursor: 'pointer' }} >
            {isLiked ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon sx={{ cursor: 'pointer' }} color='error' />}
          </Box>

          {(likes?.length > 0) && (
            <>
              <LikesList postId={post?._id} likes={likes} />
            </>
          )}
        </Box>

        <Typography variant='p' sx={{ fontSize: 12, ml: 1.5 }}>
          Comments: {comments?.length > 0 ? `${comments?.length} total` : 'No comment'}
        </Typography>

        {!post?._id && loading ? <Skeleton variant="rectangular" sx={{ width: '100%', height: { xs: '10rem', sm: '20rem' } }}

        /> : (
          (comments?.length > 0) && <CardContent>
            {comments?.map((comment) => (
              <PostComments
                key={comment?._id}
                comment={comment}
                postId={post?._id}
                user={user}
                setComments={setComments}

              />
            ))}
          </CardContent>
        )}


        {!post?._id && loading ? <Skeleton variant="rectangular" sx={{ width: '100%', height: '4rem' }} /> : <CommentInputField
          user={user}
          postId={post?._id}
          setComments={setComments} />
        }

      </Card>
    </Container>
  )
}

export default PostPage;

PostPage.getInitialProps = async (ctx) => {
  try {
    const { postId } = ctx.query;
    const { token } = parseCookies(ctx);

    const url = `${baseUrl}/posts/${postId}`;
    const header = { headers: { Authorization: token } };

    const res = await axios.get(url, header);

    if (res.data.status !== 'ok') throw res.data.message

    return { post: res.data.data };
  } catch (error) {
    return { errorLoading: true };
  }
};