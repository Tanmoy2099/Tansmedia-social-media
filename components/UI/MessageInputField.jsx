import { useState } from 'react'
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';



const MessageInputField = ({ text, setText, handleSubmit,loading }) => {


  const InputFsStyle = { style: { fontSize: 18 } };


  return <>

    <Box component="form" onSubmit={handleSubmit} noValidate
      sx={{ m: 1, position: 'relative', display: 'flex' }}>

      <TextField
        size="small"
        margin="normal"
        variant="outlined"
        color='success'
        fullWidth
        name="message"
        label="Create message"
        type="text"
        id="message"
        multiline
        maxRows={2}
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
          {loading ? <CircularProgress size='80%' /> : <SendIcon />}
        </Button>
      </Box>
    </Box>
  </>
}

export default MessageInputField;