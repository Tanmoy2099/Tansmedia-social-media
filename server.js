const express = require('express');
const next = require('next');

const connectDb = require('./utilsServer/connectDb');
const mongoSanitize = require('express-mongo-sanitize');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });

const app = express();
app.use(express.json());

// const server = require('http').Server(app);
// const io = require('socket.io')(server);

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});



const authRouter = require('./api/router/authRouter');
const chatRouter = require('./api/router/chatRouter');
const postRouter = require('./api/router/postRouter');
const searchRouter = require('./api/router/searchRouter');
const profileRouter = require('./api/router/profileRouter');
const globleError = require('./api/controllers/errorController');
const notificationsRouter = require('./api/router/notificationsRouter');


const handle = nextApp.getRequestHandler();
require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 3000;


connectDb();


const { addUser, removeUser, findConnectedUser } = require("./utilsServer/roomActions");
const { loadMessages, sendMsg, setMsgToUnread, deleteMsg } = require("./utilsServer/messageActions");

const { likeOrUnlikePost } = require("./utilsServer/likeOrUnlikePost");
const { newCommentNotification } = require('./utilsServer/gotNewComment');


const unHandledCrash = (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  process.exit(1);
}



process.on('uncaughtException', error => {
  unHandledCrash({ error, name: error.name, message: error.message });
});

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());



io.on('connection', socket => {

  socket.on('join', async ({ userId }) => {

    const users = await addUser(userId, socket.id);

    setInterval(() => socket.emit('connectedUsers', { users: users.filter(user => user.userId !== userId) }, 10000))
  });

  socket.on('loadMessages', async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);

    error ? socket.emit('noChatFound') : socket.emit('messagesLoaded', { chat })

  })

  const sendNewMsgOrMSgNotification = async (values, forNewMsg = false) => {

    const { userId, msgSendToUserId, msg } = values
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);

    const receiverSocket = findConnectedUser(msgSendToUserId);

    if (receiverSocket) {

      //send to a specific socket
      io.to(receiverSocket.socketId).emit('newMsgReceived', { newMsg })
    } else {
      await setMsgToUnread(msgSendToUserId);
    }


    !error && (forNewMsg ? socket.emit('msgSent', { newMsg }) : socket.emit('msgSentFromNotification'));
  }

  socket.on('sendNewMsg', async (values) => {
    await sendNewMsgOrMSgNotification(values, true);
  })


  socket.on('sendMsgFromNotification', async (values) => {
    await sendNewMsgOrMSgNotification(values);
  })


  socket.on('deleteMsg', async ({ userId, messagesWith, messageId }) => {
    const success = await deleteMsg(userId, messagesWith, messageId);

    if (success) {
      socket.emit('msgDeleted');
    }
  })

  socket.on('likePost', async ({ postId, userId, like }) => {
    const {
      success,
      name,
      profilePicUrl,
      username,
      postByUserId,
      error } = await likeOrUnlikePost(postId, userId, like)

    if (success) {
      socket.emit('postLiked')

      if (postByUserId !== userId) {

        const receiverSocket = findConnectedUser(postByUserId);

        if (receiverSocket && like) {

          //use 'to' when i want to send data to any specific client, using the socketId
          io.to(receiverSocket.socketId).emit('newLikeNotificationReceived', { name, profilePicUrl, username, postId })
        }
      }
    }
  })


  socket.on('commentAPost', async ({ text, postId, commentingUserId }) => {

    const { success, name, profilePicUrl, username, postOwnerId, newComment, error } = await newCommentNotification(text, postId, commentingUserId)

    if (success) {
      socket.emit('newCommentAdded', { newComment })

      if (postOwnerId !== commentingUserId) {
        const receiverSocket = findConnectedUser(postOwnerId);

        if (receiverSocket) {
          io.to(receiverSocket.socketId).emit('newCommentNotificatioReceived', { name, profilePicUrl, username, postId, commentingUserId })
        }
      }
    }
  })



  socket.on('disconnect', () => removeUser(socket.id))
});



nextApp.prepare().then(() => {

  app.use('/api/v1/user', authRouter);
  app.use('/api/v1/search', searchRouter);
  app.use('/api/v1/posts', postRouter);
  app.use('/api/v1/profile', profileRouter);
  app.use('/api/v1/notifications', notificationsRouter);
  app.use('/api/v1/chats', chatRouter);


  app.all('*', (req, res) => handle(req, res));

  app.use(globleError);


  httpServer.listen(port, err => {
    if (err) throw err;
    console.log(`Server is running at port: ${port}`);
  })

});



process.on('unhandledRejection', error => {
  unHandledCrash({ error, name: error.name, message: error.message })
});
