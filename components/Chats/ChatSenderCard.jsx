import { useState } from 'react';

import { Avatar, Box, Badge, IconButton, List, ListItem, ListItemAvatar, ListItemText, Popover, Button, Paper } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { styled } from '@mui/material/styles';

import { useRouter } from "next/router";
import calculateTime from "../../utils/calculateTime";
import StyledBadge from '../UI/StyledBadge';


const ChatSenderCard = ({ chat, connectedUsers, deleteChat }) => {
  const [anchor, setAnchor] = useState(false);
  const router = useRouter();

  const isOnline = connectedUsers.length > 0 && connectedUsers.filter(user => user.userId === chat.messagesWith).length > 0;



  const popupDelete = <>
    <IconButton aria-label="delete"
      onClick={(e) => setAnchor(e.currentTarget)}
      sx={{ height: 'fit-content', my: 'auto' }}>
      <DeleteOutlineIcon sx={{ color: 'white' }} />
    </IconButton>

    <Popover
      open={Boolean(anchor)}
      anchorEl={anchor}
      anchorOrigin={{
        vertical: 10,
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 50,
        horizontal: 10
      }}
      onClose={() => setAnchor(null)}
    >
      <Box sx={{
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <h6>Delete chat</h6>
        <Button variant='contained'
          color='error'
          size="small"
          sx={{ my: 1, mx: 'auto' }}
          onClick={() => deleteChat(chat.messagesWith)}
        >Delete</Button>
      </Box>
    </Popover>
  </>




  // const badgeStyle = { cursor: 'pointer', height: 'fit-content', m: 'auto', fontSize: '25' };


  return (
    <Paper >
      <List sx={{
        maxWidth: '25rem',
        color: 'white',
        borderRadius: '5px',
        cursor: 'pointer',
        bgcolor: (router.query.message === chat.messagesWith) ? '#002981' : '#0029c1',
        '&:hover': {
          bgColor: '#002981'
        }

      }}>
        <ListItem alignItems="flex-start"
          onClick={() => router.push(`/messages?message=${chat.messagesWith}`, undefined, { shallow: true })} >

          <ListItemAvatar>
            {/* <Badge color='success'
              variant="dot"
              invisible={!isOnline}
              aria-label={chat.name}
              sx={badgeStyle}>
              <Avatar alt="user pic" src={chat.profilePicUrl} />
            </Badge> */}


            <StyledBadge
              overlap="circular"
              invisible={!isOnline}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar alt="user pic" src={chat.profilePicUrl} />
            </StyledBadge>








          </ListItemAvatar>

          <ListItemText
            primary={<h5 > {chat.name} </h5>}

            secondary={<>
              <span style={{ color: 'white', diaplay: 'block' }}>
                {chat.lastMessage?.length > 20 ? `${chat.lastMessage.substring(0, 20)} ...` : chat.lastMessage}
              </span>
              <br />
              <span style={{ fontSize: '0.65rem', color: 'white' }} >{calculateTime(chat.date)}</span>
            </>
            }
          />
          <Box sx={{ flexGrow: 1 }} />
          {popupDelete}
        </ListItem>
      </List>
    </Paper>
  )
}

export default ChatSenderCard;