

const ChatModel = require('../../models/ChatModel');
const UserModel = require('../../models/UserModel');
const catchAsync = require('../../utilsServer/catchAsync');
const AppError = require('../../utilsServer/customError');







exports.getAllChats = catchAsync(async (req, res, next) => {

  const { userId } = req;

  const user = await ChatModel.findOne({ user: userId })
    .populate('chats.messagesWith');

  if (!user) return next(new AppError(404, 'User Not Found'));


  let chatsToBeSent = [];

  if (user.chats.length > 0) {
    chatsToBeSent = user.chats.map(chat => ({
      messagesWith: chat.messagesWith._id,
      name: chat.messagesWith.name,
      profilePicUrl: chat.messagesWith.profilePicUrl,
      lastMessage: chat.messages[chat.messages.length - 1].msg,
      date: chat.messages[chat.messages.length - 1].date
    }));
  }


  res.status(200).json({
    status: 'ok',
    data: chatsToBeSent
  });
});


exports.getUserInfo = catchAsync(async (req, res, next) => {

  const { userId } = req;

  const user = await UserModel.findById(req.params.userToFindId);

  if (!user) return next(new AppError(404, 'User Not Found'));


  res.status(200).jason({
    status: 'ok',
    data: {
      name: user.name,
      profilePicUrl: user.profilePicUrl
    }
  })

})

exports.deleteAChat = catchAsync(async (req, res, next) => {

  const { userId } = req;
  const { messagesWith } = req.params;

  const chat = await ChatModel.findOneAndUpdate(
    { user: userId },
    { $pull: { chats: { messagesWith } } }
  );

  if (!chat) return next(new AppError(401, 'Could not Delete'))

  res.status(200).json({
    status: 'ok'
  })
});