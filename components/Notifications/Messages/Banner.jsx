import { Avatar, Box, Divider, ListItem, ListItemAvatar, ListItemText, Paper } from '@mui/material';
import React from 'react';


const Banner = ({ bannerData }) => {

  const { name, profilePicUrl } = bannerData;




  return <>
    <Paper>
      <ListItem alignItems="flex-start" sx={{ cursor: 'pointer', width: 'fit-content' }}>
        <ListItemAvatar>
          <Avatar alt="profile pic" src={profilePicUrl} />
        </ListItemAvatar>
        <ListItemText
          sx={{ width: 'fit-content', maxWidth: '10rem' }}
          primary={name}
        />
      </ListItem>
    </Paper>
    <Divider />
  </>
}

export default Banner;