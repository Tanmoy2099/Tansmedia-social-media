

const NotificationModel = require('../../models/NotificationModel');
const UserModel = require('../../models/UserModel');
const catchAsync = require('../../utilsServer/catchAsync');
const AppError = require('../../utilsServer/customError');



//GET NOTIFICATION
exports.getNotification = catchAsync(async (req, res, next) => {

  const { userId } = req;

  const user = await NotificationModel.findOne({ user: userId })
    .populate('notifications.user')
    .populate('notifications.post')


  if (!user) return next(new AppError(404, 'User Not Found'));


  res.status(200).json({
    status: 'ok',
    total: user.notifications.length,
    data: user.notifications
  })
});

//POST NOTIFICATION
exports.postNotification = catchAsync(async (req, res, next) => {

  const { userId } = req;

  const user = await UserModel.findById(userId)
  if (!user) return next(new AppError(404, 'User Not Found'));


  if (user.unreadNotification) {
    const updated = await UserModel.findByIdAndUpdate(userId, { unreadNotification: false }, {
      new: true,
      runValidators: false
    });
    if (!updated) return next(new AppError(404, 'User Not Updated'));

    // user.unreadNotification = false;
    // await user.save();
  }




  res.status(200).json({
    status: 'ok',
  })
});

