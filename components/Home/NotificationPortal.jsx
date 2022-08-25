
import { Avatar, CardHeader, IconButton, Paper, Button, Snackbar, Typography, Slide } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useRouter } from 'next/router';
import { useSelector } from "react-redux";


// import newMsgSound from "../../utils/newMsgSound";
import calculateTime from "../../utils/calculateTime";
import { styled } from "@mui/material/styles";





const NotificationPortal = ({ newNotification, notificationPopup, setNotificationPopup }) => {

  const router = useRouter();
  const { darkMode } = useSelector(state => state.utility);


  const { name, profilePicUrl, username, postId, type } = newNotification;



  const linkColor = { color: darkMode ? '#fbc02d' : '#3f51b5' };
  const linkStyle = { cursor: 'pointer', '&:hover': { fontStyle: 'italic' } };
  const linkTypography = (value, sx) => <Typography component='span' variant='body2' sx={sx}> {value}</Typography>


  const typeOfNotification = () => {
    if (type === 'like') {
      return linkTypography('liked your')
    }
    else if (type === 'comment') {
      return linkTypography('commented in your')

    }
    else if (type === 'follow') {
      return linkTypography('started following you')
    }
  }



  const notificationCard = <Paper sx={{ width: 'fit-content', height: 'fit-content', display: 'flex' }}>


    <CardHeader
      avatar={
        <a onClick={() => router.push(`/${username}`)}>
          <Avatar sizes='small' src={profilePicUrl} />
        </a>
      }
      title={<>
        <a onClick={() => router.push(`/${username}`)} >
          {linkTypography(name, { color: 'primary', ...linkColor, ...linkStyle })}
        </a>

        {typeOfNotification()}

        {type !== 'follow' && <a onClick={() => router.push(`/posts/${postId}`)} >
          {linkTypography('post.', { ...linkColor, ...linkStyle })}
        </a>
        }
      </>
      }

      subheader={<Typography sx={{ fontSize: '0.7rem' }}>{calculateTime(Date.now())}</Typography>}
    />
    {action}

  </Paper>




  function SlideTransition(props) {
    return <Slide {...props} direction="left" />;
  }



  const action = (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
    >
      <CloseIcon fontSize="small" onClick={handleClose} />

    </IconButton>
  );

  const handleClose = () => setNotificationPopup(false);



  return (
    <>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ p: 0, m: 0, mt:'3rem' }}
        open={notificationPopup}
        autoHideDuration={8000}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
      >
        {notificationCard}
      </Snackbar>


    </>
  )
}

export default NotificationPortal;