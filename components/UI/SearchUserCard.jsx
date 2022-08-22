

import { ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material";
import Link from "next/link";

const SearchUserCard = ({ name, username, profilePicUrl }) => {
  return <>
    <Link href={`/${username}`} >
    <ListItem alignItems="flex-start" sx={{cursor:'pointer'}}>
      <ListItemAvatar>
        <Avatar alt={name} src={profilePicUrl} />
      </ListItemAvatar>
      <ListItemText
        primary={name}
        secondary={
          <>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="white"
            >
              Username: {username}
            </Typography>
          </>
        }
      />
      </ListItem>
    </Link>
    <Divider variant="inset" component="li" />
  </>
}

export default SearchUserCard;