import { useState } from 'react'
import Link from 'next/link';
import { Badge, Box, IconButton, Paper } from '@mui/material';
import Banner from '../Notifications/Messages/Banner';
import Message from '../Notifications/Messages/Message';
import MessageInputField from '../UI/MessageInputField';

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const MessageNotificationModel = ({ socket, showNewMessageModel, newMessageModel, user }) => {

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const onModalClose = () => showNewMessageModel(false);

  const bannerData = {
    name: user.name,
    profilePiUrl: user.profilePiUrl
  }


  const handleSubmit = async e => {
    e.preventDefault();

    if (socket.current) {
      socket.current.emit('sendMsgFromNotification', {
        userId: user._id,
        msgSendToUserId: newMessageReceived.sender,
        msg: text
      })

      socket.current.on('msgSentFromNotification', () => {
        showNewMessageModel(false)
      })

    }

  };


  return <>
    {newMessageModel && <Paper sx={{
      position: 'absolute',
      bottom: 0,
      right: { xs: 0, sm: 0, md: 5 },
      height: { sm: '80vh', md: '30rem' }
    }}>


      <Box sx={{
        width: { xs: '100%', sm: '100%', md: '25rem' },
        position: 'relative'
      }} >
        <Badge variant='dot'>
          <IconButton sx={{
            position: 'absolute',
            width: '5%',
            top: 0,
            right: '45%'
          }}
            onClick={() => setShow(prev => !prev)}
          >
            {show ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
          </IconButton>
        </Badge>

        {/* MESSAGE WINDOW */}
        {show && <Paper sx={{
          m: { xs: 0, sm: 0, md: 1 },
          minWidth: '100%',
          // position: 'relative',
          overFlow: 'auto',
          overflowX: 'hidden',
          maxHeight: '35rem',
          display: 'grid',
          gridTemplateRows: '1fr 4fr 1fr',
        }}>

          <Box >
            <p>New Message</p>
            <Banner bannerData={bannerData} />
          </Box>


          <Box>
            {messages.length > 0 && (
              <>
                {messages.map((message, i) => (
                  <Message
                    positionRef={positionRef}
                    key={i}
                    bannerProfilePic={bannerData.profilePicUrl}
                    message={message}
                    user={user}
                    deleteMsg={deleteMsg}
                  />
                ))}
              </>
            )}
          </Box>
          <Box >
            <MessageInputField
              text={text}
              setText={setText}
              loading={loading}
              handleSubmit={handleSubmit}
            />
          </Box>

          <Box sx={{ mt: 0.5 }}>
            <Link href={`/messages?message=${newMessageReceived.sender}`} />
          </Box>
        </Paper>}

      </Box>
    </Paper>

}
  </>

}

export default MessageNotificationModel;