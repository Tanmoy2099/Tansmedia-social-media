
import { Avatar, Card, CardHeader, CardMedia, Divider, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import { useSelector } from "react-redux";

import calculateTime from '../../utils/calculateTime';


const LikeNotification = ({ notification }) => {

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
            {linkTypography('liked your')}
            <Link href={`/posts/${notification.post._id}`} >
              {linkTypography('post.', { ...linkColor, ...linkStyle })}
            </Link>
          </>}
          subheader={linkTypography(calculateTime(notification.date))}
        />

        {notification.post.picUrl && (<>
          <Link href={`/posts/${notification.post._id}`} >
            <CardMedia
              component="img"
              sx={{ maxWidth: '30rem', ml: 0.5, mb: 1, cursor: 'pointer' }}
              image={notification.post.picUrl}
              alt={notification.user.name}
            />
          </Link>
        </>)
        }

      </Card>
    </Paper>
  )
}

export default LikeNotification;