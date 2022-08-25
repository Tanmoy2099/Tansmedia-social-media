import { useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

import SnackBarMsg from '../UI/SnackBarMsg';
import { postComment } from "../../utils/postActions";
import { array } from "prop-types";

const CommentInputField = ({ postId, user, setComments, socket }) => {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const initialMsg = { hasMsg: false, type: '', message: '' }
  const [msg, setMsg] = useState(initialMsg);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    if (socket.current) {
      socket.current.emit('commentAPost', {
        text,
        postId,
        commentingUserId: user
      })

      socket.current.on('newCommentAdded', ({ newComment }) => {
        setComments(prev => [...new Set([newComment, ...prev])]);
      })

      setText('')

    } else {

      await postComment(postId, user, text, setComments, setText, setMsg);
    }
    setLoading(false);
  }


  const InputFsStyle = { style: { fontSize: 18 } };
  return (
    <>
      <SnackBarMsg msg={msg} setMsg={setMsg} />

      <Box component="form" onSubmit={handleSubmit} noValidate
        sx={{ m: 1, position: 'relative', display: 'flex' }}>

        <TextField
          size="small"
          margin="normal"
          variant="outlined"
          color='success'
          fullWidth
          name="comment"
          label="Create Comment"
          type="text"
          id="about"
          multiline
          maxRows={3}
          autoComplete="off"
          InputProps={InputFsStyle}
          InputLabelProps={InputFsStyle}
          labelwidth={20}
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Box sx={{ display: 'flex' }}>

          <Button type='submit'
            disabled={!text || loading}
            sx={{ height: '2.5rem', m: 'auto 0.3rem' }}
            variant="contained">
            {loading ? <CircularProgress size='2rem' /> : <SendIcon />}
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default CommentInputField;