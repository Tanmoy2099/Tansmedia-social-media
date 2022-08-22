
import { ListItem, Divider, ListItemText, ListItemAvatar, Avatar, Typography } from "@mui/material";

const MsgAlertCard = (props) => {

  const { data, onClick } = props;
  const { name, username, profilePicUrl } = data;

  return <>
    {/* <Link href={`/${username}`} > */}
    <ListItem
      onClick={() => onClick(data)}
      alignItems="flex-start" sx={{ cursor: 'pointer' }}>
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
    {/* </Link> */}
    <Divider variant="inset" component="li" />
  </>
}

export default MsgAlertCard;