import { useState } from 'react'
import Link from 'next/link';
import { AppBar, Backdrop, Badge, Box, IconButton, Paper, Snackbar, Typography } from '@mui/material';
import Banner from '../Notifications/Messages/Banner';
// import Message from '../Notifications/Messages/Message';
import MessageInputField from '../UI/MessageInputField';

import calculateTime from '../../utils/calculateTime';

import CloseIcon from '@mui/icons-material/Close';






const MessageNotificationModel = ({ socket, showNewMessageModel, newMessageModel, user, newMessageReceived }) => {

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);


  const onClose = () => showNewMessageModel(false);

  const bannerData = {
    name: newMessageReceived.senderName,
    profilePicUrl: newMessageReceived.senderProfilePicUrl
  }



  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true)
    if (socket.current) {
      socket.current.emit('sendMsgFromNotification', {
        userId: user._id,
        msgSendToUserId: newMessageReceived.sender,
        msg: text
      })

      socket.current.on('msgSentFromNotification', () => {
        showNewMessageModel(false)

        setLoading(false)
      })

    }

  };

  const messageSnackbar = <>
    {newMessageModel && (
      <Box sx={{
        minWidth: 'fit-content',
        height: '18rem',
        width: { xs: '80%', sm: '18rem', md: '20rem' },
      }}>
        <Paper>

          <Box sx={{ position: 'relative' }} >




            {/* MESSAGE WINDOW */}
            {/* {show && */}
            <Box sx={{
              m: { xs: 0, sm: 0, md: 1 },
              overFlow: 'auto',
              overflowX: 'hidden',
              maxHeight: '25rem',
              display: 'grid',
              gridTemplateRows: '1fr 2fr 1fr',
            }}>

              <Paper sx={{ position: 'relative' }}>

                <IconButton aria-label="close button"
                  size='small'
                  sx={{ width: 'fit-content', position: 'absolute' }}
                  onClick={onClose}>
                  <CloseIcon />
                </IconButton>

                <Typography sx={{ textAlign: 'center', mt: 1 }}>New Message</Typography>
                <Banner bannerData={bannerData} />
              </Paper>

              <Box>
                <div className='bubbleWrapper'>

                  <div className={'inlineContainer'} >

                    <div className={'otherBubble other'}> {newMessageReceived.msg} </div>

                  </div>

                  <span className={'other'}> {calculateTime(newMessageReceived.date)} </span>

                </div>
              </Box>
              <Box >
                <MessageInputField
                  text={text}
                  setText={setText}
                  loading={loading}
                  handleSubmit={handleSubmit}
                />
              </Box>

              <Box sx={{ my: 0.5 }}>
                <Link href={`/messages?message=${newMessageReceived.sender}`} >
                  <Typography sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { color: 'yellow' } }} >
                    <a>
                      View All messages
                    </a>
                  </Typography>
                </Link>
                <Typography sx={{ textAlign: 'center', fontSize: '0.8rem' }} >
                  You can turn off message popup from the settings
                </Typography>
              </Box>
            </Box>
            {/* } */}

          </Box>
        </Paper>
      </Box>
    )}
  </>


  return <>
    <Backdrop
      sx={{ color: '#fff', zIndex: 11 }}
      open={newMessageModel}
    >
      {messageSnackbar}
    </Backdrop>
  </>
}

export default MessageNotificationModel;