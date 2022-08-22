import { useState } from 'react';

import { Popover, Typography, Button, Box, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import calculateTime from '../../../utils/calculateTime';




const Message = ({ message, user, deleteMsg, bannerProfilePic, positionRef }) => {
  const [anchor, setAnchor] = useState(null);
  const [deleteIcon, setDeleteIcon] = useState(false);

  const ifyouSender = message.sender === user._id;



  const popupDelete = <>
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
        <Typography component='p' >Delete from chat window</Typography>
        <Button variant='contained'
          color='error'
          size="small"
          sx={{ my: 1, mx: 'auto' }}
          onClick={() => deleteMsg(message._id)}
        >Delete</Button>
      </Box>
    </Popover>
  </>

  return <>
    <div className='bubbleWrapper' ref={positionRef}>

      <div className={ifyouSender ? 'inlineContainer own' : 'inlineContainer'}
        onClick={() => ifyouSender && setDeleteIcon(prev => !prev)}
      >
        <img className={ifyouSender ? user.profilePicUrl : bannerProfilePic} alt='propic ' />
        <div className={ifyouSender ? 'ownBubble own' : 'otherbubble other'}>
          {message.msg}
        </div>


      </div>

      {deleteIcon && popupDelete}


      <span className={ifyouSender ? 'own' : 'other'}>
        {calculateTime(message.date)}
      </span>

    </div>
  </>
}

export default Message;