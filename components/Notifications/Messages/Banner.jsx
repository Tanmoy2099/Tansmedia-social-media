import React from 'react';
import { Avatar, Box, Divider, ListItem, ListItemAvatar, ListItemText, Paper } from '@mui/material';

import StyledBadge from '../../UI/StyledBadge';

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