import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import { Tooltip } from '@mui/material';

import MessageNotificationModel from '../Home/MessageNotificationModel';
import NotificationPortal from '../Home/NotificationPortal';

import { pureBaseUrl } from '../../utils/baseUrl';
import newMsgSound from '../../utils/newMsgSound';
import getUserInfo from '../../utils/getUserInfo';



const SocketOperation = ({ user, children, socket }) => {


  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModel, setNewMessageModel] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [notificationPopup, setNotificationPopup] = useState(false);



  useEffect(() => {

    if (!socket.current) {
      socket.current = io(pureBaseUrl)
    }

    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePicUrl: profilePicUrl
          });
          setNewMessageModel(true);
        }

        newMsgSound(name);

      });
    }

    if (socket.current) {
      socket.current.on('newLikeNotificationReceived', ({ name, profilePicUrl, username, postId }) => {
        setNewNotification({ name, profilePicUrl, username, postId, type: 'like' });

        setNotificationPopup(true);
      })
    }

    if (socket.current) {
      socket.current.on('newCommentNotificatioReceived', ({ name, profilePicUrl, username, postId, commentingUserId }) => {

        if (user._id !== commentingUserId) {
          setNewNotification({ name, profilePicUrl, username, postId, type: 'comment' });

          setNotificationPopup(true);
        }
      })
    }

  }, []);



  return (
    <>
      {newNotification !== null && (

        <Tooltip title='Notification' >
          <NotificationPortal
            newNotification={newNotification}
            notificationPopup={notificationPopup}
            setNotificationPopup={setNotificationPopup}
          />
        </Tooltip>

      )}

      {newMessageModel && newMessageReceived !== null && (
        <MessageNotificationModel
          socket={socket}
          showNewMessageModel={setNewMessageModel}
          newMessageModel={newMessageModel}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}

      {children}

    </>
  )
}

export default SocketOperation;