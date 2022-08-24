

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

  const { userToFindId } = req.params;

  const user = await UserModel.findById(userToFindId);

  if (!user) return next(new AppError(404, 'User Not Found'));

  const data = {
    name: user.name,
    profilePicUrl: user.profilePicUrl
  }


  res.status(200).json({
    status: 'ok',
    data
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