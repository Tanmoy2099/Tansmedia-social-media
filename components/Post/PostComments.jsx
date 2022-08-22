
import { useState } from 'react';

import { Avatar, Box, Button, Grid, IconButton, Paper, Popover, Typography } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import SnackBarMsg from '../UI/SnackBarMsg';
import { deleteComment } from '../../utils/postActions';
import calculateTime from '../../utils/calculateTime';


function PostComments({ comment, user, setComments, postId }) {

  const [anchor, setAnchor] = useState(null);

    const initialMsg = { hasMsg: false, type: '', message: '' }
  const [msg, setMsg] = useState(initialMsg);


  return (
<>
    <SnackBarMsg msg={msg} setMsg={setMsg} />
    <Paper style={{ padding: "20px 10px", display: 'flex' }}>
      <Grid container wrap="nowrap" spacing={2}>
        <Grid item>
          <Avatar alt="Sharp"
            sx={{ height: { sm: '2rem', md:'3rem' }, width: {sm: '2rem', md:'3rem'}}}
            src={comment.user.profilePicUrl} />
        </Grid>
        <Grid justifyContent="left" item xs zeroMinWidth>
          <h5 style={{ margin: 0, textAlign: "left" }}>{comment.user.name}</h5>
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
            </Popover>
          </>
        )}

      </Grid>


      </Paper>
    </>
  );
};

export default PostComments;