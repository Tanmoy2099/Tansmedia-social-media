
import { useState } from 'react';

import { Avatar, Box, Button, Divider, Grid, IconButton, Paper, Popover, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import SnackBarMsg from '../UI/SnackBarMsg';
import { deleteComment } from '../../utils/postActions';
import calculateTime from '../../utils/calculateTime';
import Link from 'next/link';

import { useSelector } from 'react-redux';

function PostComments({ comment, user, setComments, postId }) {

  const { darkMode } = useSelector(state => state.utility);


  const [anchor, setAnchor] = useState(null);

  const initialMsg = { hasMsg: false, type: '', message: '' }
  const [msg, setMsg] = useState(initialMsg);


  return (
    <>
      <SnackBarMsg msg={msg} setMsg={setMsg} />

      <Paper style={{ padding: "20px 10px", display: 'flex' }} >
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Link href={`/${comment.user.username}`}>
              <Avatar alt="Sharp"
                sx={{
                  height: { sm: '2rem', md: '3rem' },
                  width: { sm: '2rem', md: '3rem' },
                  cursor: 'pointer'
                }}
                src={comment.user.profilePicUrl} />
            </Link>
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <Box sx={{ color: 'primary' }}>
              <Link href={`/${comment.user.username}`}>
                <Typography compoment='h5' sx={{
                  cursor: 'pointer', margin: 0, textAlign: "left",
                  width: 'fit-content',
                  '&:hover': {
                    color: darkMode ? 'yellow' : 'blue',
                  }
                }}>{comment.user.name}</Typography>
              </Link>
            </Box>
            <Typography variant="body2" sx={{ textAlign: "left" }}>{comment.text}{" "}</Typography>

            <h6 style={{ textAlign: "left", color: "gray" }}>
              {calculateTime(comment.date)}
            </h6>

          </Grid>

          {(user.role === 'root' || comment.user._id === user._id) && (
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
                    onClick={() => deleteComment(postId, comment._id, setComments, setMsg)}
                  >Delete</Button>
                </Box>

                <Divider />
              </Popover>
            </>
          )}

        </Grid>


      </Paper>
    </>
  );
};

export default PostComments;