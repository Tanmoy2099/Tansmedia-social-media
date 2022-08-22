
import { Avatar, Card, CardHeader, CardMedia, Typography, CardContent, Paper, Divider } from '@mui/material';

import Link from 'next/link';
import { useSelector } from "react-redux";

import calculateTime from '../../utils/calculateTime';

const CommentNotification = ({ notification }) => {

  const { darkMode } = useSelector(state => state.utility);

  const linkColor = { color: darkMode ? '#fbc02d' : '#3f51b5' };
  const linkStyle = { cursor: 'pointer', '&:hover': { fontStyle: 'italic' } };
  const linkTypography = (value, sx) => <Typography component='span' variant='body2' sx={sx}> {value}</Typography>


  return (
    <Paper sx={{ display: 'flex', mb: 1 }}>
      <Divider />
      <Card sx={{ width: '100%', height: 'fit-content', fontSize: '1.2rem' }}>

        <CardHeader
          avatar={<Avatar src={notification.user.profilePicUrl} />}
          title={<>
            <Link href={`/${notification.user.username}`}>{linkTypography(notification.user.name, { color: 'primary', ...linkColor, ...linkStyle })}
            </Link>
            {linkTypography('commented on your')}
            <Link href={`/posts/${notification.post._id}`} >
              {linkTypography('post.', {...linkColor, ...linkStyle} )}
            </Link>
          </>}
          subheader={<Link href={`/posts/${notification.post._id}`}>
            {linkTypography(calculateTime(notification.date))}
          </Link>}
        />
        {
          notification.post.picUrl && (<>
            <Link href={`/posts/${notification.post._id}`}>
              <CardMedia
                component="img"
                sx={{maxWidth:'30rem', ml:0.5, mb:1}}
                image={notification.post.picUrl}
                alt={notification.user.name}
              />
            </Link>

          </>)
        }
        <Divider />
        <CardContent>
          {linkTypography(notification.text, { color: "text.secondary" })}
        </CardContent>

      </Card>
    </Paper>
  )
}

export default CommentNotification;