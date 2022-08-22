import { useState } from 'react';

import { Avatar, Box, Badge, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography, Popover, Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { useRouter } from "next/router";
import calculateTime from "../../utils/calculateTime";



const ChatSenderCard = ({ chat, connectedUsers, deleteChat }) => {
  const [anchor, setAnchor] = useState(null);
  const router = useRouter();

  console.log(connectedUsers)  // Remove log

  const isOnline = connectedUsers.length > 0 && connectedUsers.filter(user => user.userId === chat.messagesWith).length > 0;




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
        <Typography component='p' >Delete chat</Typography>
        <Button variant='contained'
          color='error'
          size="small"
          sx={{ my: 1, mx: 'auto' }}
          onClick={() => deleteChat(chat.messagesWith)}
        >Delete</Button>
      </Box>
    </Popover>
  </>







  const badgeStyle = { cursor: 'pointer', height: 'fit-content', margin: 'auto 0.4rem' };


  return (
    <>
      <List sx={{
        maxWidth: '25rem',
        color: 'white',
        borderRadius: '5px',
        bgcolor: (router.query?.message === chat.messagesWith) ? '#002984' : '#039be5',
        '&:hover': {
          bgColor: '#002984'
        }

      }}>
        <ListItem alignItems="flex-start"
          onClick={() => router.push(`/messages?message=${chat.messagesWith}`, undefined, { shallow: true })} >

          <ListItemAvatar>
            <Badge color="warning"
              variant="dot"
              invisible={!isOnline}
              aria-label={chat.name}
              sx={badgeStyle}>
              <Avatar alt="user pic" src={chat.profilePicUrl} />
            </Badge>
          </ListItemAvatar>

          <ListItemText
            primary={
              <>

                <Typography variant='span' component='h5'>
                  {chat.name}{' | '} <Typography variant='span' style={{ fontSize: '0.7rem' }} >{calculateTime(chat.date)}</Typography>
                </Typography>
              </>
            }
            secondary={<Typography variant='span' component='h5'>
              {chat.lastMessage?.length > 20
                ? `${chat.lastMessage.substring(0, 20)} ...`
                : chat.lastMessage}
            </Typography>
            }
          />
          <Box sx={{ flexGrow: 1 }} />
          {popupDelete}
        </ListItem>
      </List>
    </>
  )
}

export default ChatSenderCard;