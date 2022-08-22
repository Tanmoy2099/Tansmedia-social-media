const express = require('express');
const next = require('next');


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
const notificationsRouter = require('./api/router/notificationsRouter');

const globleError = require('./api/controllers/errorController');

const handle = nextApp.getRequestHandler();
require('dotenv').config({ path: './config.env' });
const port = process.env.PORT || 3000;


const connectDb = require('./utilsServer/connectDb');
connectDb();


const { addUser, removeUser, findConnectedUser } = require("./utilsServer/roomActions");
const { loadMessages, sendMsg, setMsgToUnread, deleteMsg } = require("./utilsServer/messageActions");

const { likeOrUnlikePost } = require("./utilsServer/likeOrUnlikePost");



const unHandledCrash = (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err);
  // process.exit(1);
}



process.on('uncaughtException', error => {
  unHandledCrash({ error, name: error.name, message: error.message });
});


io.on('connection', socket => {

  socket.on('join', async ({ userId }) => {

    const users = await addUser(userId, socket.id);

    console.log(users)

    setInterval(() => {
      socket.emit('connectedUsers', { users: users.filter(user => user.userId !== userId) }, 10000)
    })
  });

  socket.on('loadMessages', async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);

    if (!error) {
      socket.emit('messagesLoaded', { chat })
    }
    else {
      socket.emit('noChatFound');
    }
  })

  
  
  socket.on('sendNewMsg', async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
    
    const receiverSocket = findConnectedUser(msgSendToUserId);
    
    if (receiverSocket) {
      //send to a specific socket
      io.to(receiverSocket.socketId).emit('newMsgReceived', { newMsg })
    } else {
      await setMsgToUnread(msgSendToUserId);
    }
    
    if (!error) socket.emit('msgSent', { newMsg });
    
  })
  
  socket.on('deleteMsg', async ({ userId, messagesWith, messageId }) => {
    const { success } = await deleteMsg(userId, messagesWith, messageId);

    if (success) {
      socket.emit('msgDeleted');
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
