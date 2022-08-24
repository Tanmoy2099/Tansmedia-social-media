
const jwt = require('jsonwebtoken');
const isEmail = require('validator/lib/isEmail');
const crypto = require('crypto');

const UserModel = require('../../models/UserModel');
const FollowerModel = require('../../models/FollowerModel');
const NotificationModel = require('../../models/NotificationModel');
const ChatModel = require('../../models/ChatModel');

const catchAsync = require('../../utilsServer/catchAsync');
const AppError = require('../../utilsServer/customError');
const { sendResetPasswordMail } = require('../../utilsServer/sendEmail');

const Email = require('../../utilsServer/email');

const { pureBaseUrl } = require('../../utils/baseUrl');


const userPng = 'http://res.cloudinary.com/onlinechat/image/upload/v1659950011/r3gwnmire3mn4lm9jmov.png';


const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};



const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});

const createSendToken = (id, res, statusCode = 200) => {
  const token = signToken(id);

  res.status(statusCode).json({
    status: 'ok',
    data: token
  });

}

exports.username = catchAsync(async (req, res, next) => {
  const { username } = req.params;

  if (username.length < 1 || !regexUserName.test(username)) next(new AppError(401, 'Invalid username'));

  const user = await UserModel.findOne({ username: username.toLowerCase() });
  if (user) return next(new AppError(409, 'Username is already taken'));


  res.status(200).json({ status: 'ok' });
});




exports.signup = catchAsync(async (req, res, next) => {

  const { name, username, email, password, confirmPassword, about, profilePicUrl } = req.body;

  if (!isEmail(email)) next(new AppError(401, 'Invalid Email'));
  if (password.length < 8) next(new AppError(401, 'Invalid Password'));
  if (password !== confirmPassword) next(new AppError(401, 'Confirm password not correct'));

  if (await UserModel.findOne({ email: email.toLowerCase() })) next(new AppError(401, 'User with Same Email Id already registered'));

  if (await UserModel.findOne({ username: username.toLowerCase() })) next(new AppError(409, 'Username is already taken'));

  const newUser = await UserModel.create({ name, username: username.toLowerCase(), email: email.toLowerCase(), password, about, profilePicUrl: profilePicUrl || userPng })

  await FollowerModel.create({ user: newUser._id, followers: [], following: [] });
  await NotificationModel.create({ user: newUser._id, notification: [] });
  await ChatModel.create({ user: newUser._id, chats: [] });

  const id = newUser._id;

  createSendToken(id, res, 201);

});


exports.login = catchAsync(async (req, res, next) => {

  const { email, username, password } = req.body;

  // 1) Check if email or username and password exist
  if (!(email || username)) return next(new AppError(400, 'Please provide valid email or username!'));
  if (!password) return next(new AppError(400, 'Please provide valid password!'));

  // 2) Check if user exists && password is correct
  const query = email ? { email: email.toLowerCase() } : { username: username.toLowerCase() };

  const user = await UserModel.findOne(query).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) return next(new AppError(401, 'Incorrect email or password'));


  if (!(await NotificationModel.findOne({ user: user._id }))) {
    await NotificationModel.create({ user: user._id, notifications: [] });
  }

  if (!(await ChatModel.findOne({ user: user._id }))) {
    await ChatModel.create({ user: user._id, chats: [] });
  }

  const id = user._id;

  // 3) If everything ok, send token to client
  createSendToken(id, res);
});




exports.protect = catchAsync(async (req, res, next) => {

  const { authorization } = req.headers;

  if (!authorization) {
    return next(new AppError(401, 'Unauthorized'));
  }

  // Extract user Id
  const { id, iat } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

  req.userId = id;
  req.iat = iat;

  const user = await UserModel.findById(id);
  if (!user) return next(new AppError(404, 'Please Signup first'))

  if (user.changedPasswordAfter(iat)) next(new AppError(404, 'Please Login first'))

  next();

});


exports.getUserData = catchAsync(async (req, res, next) => {

  const { userId, iat } = req;

  // 1) Check if user still exists
  const user = await UserModel.findById(userId);
  if (!user) return next(new AppError(401, 'Please signup first'));

  // 2) Check if user changed password after the token was issued
  if (user.changedPasswordAfter(iat)) return next(new AppError(401, 'Please Login first'));

  const userFollowStats = await FollowerModel.findOne({ user: userId });

  res.status(200).json({
    status: 'ok',
    data: {
      user,
      userFollowStats
    }
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const { password, confirmPassword } = req.body;
  // 1) Create error if user POSTs password data
  if (password || confirmPassword) return next(new AppError(400, 'This route is not for password updates. Please use /resetPassword.'))

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'about', 'email', 'profilePicUrl');

  if (filteredBody.email && !isEmail(filteredBody.email)) next(new AppError(401, 'Invalid Email address'));

  // 3) Update user document
  const user = await UserModel.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'ok',
    data: user
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {

  const { userId } = req;
  const { currentPassword, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) return next(new AppError(401, 'Confirm password is not correct'));

  const user = await UserModel.findById(userId).select('+password')

  const isCurrentPasswordValid = await UserModel.correctPassword(currentPassword, user.password);

  if (!isCurrentPasswordValid) return next(new AppError(401, 'current Password is not valid'));

  user.password = password;
  await user.save();

  createSendToken(userId, res, 201);
});



exports.forgotPassword = catchAsync(async (req, res, next) => {

  const { email, username } = req.body;

  let user = null;

  // 1) Get user based on POSTed email
  if (email) {
    if (!isEmail(email)) {
      return next(new AppError(404, 'Not a valid email address.'))
    }

    user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) { return next(new AppError(404, 'There is no user with this email address.')) }

  }


  else if (username) {
    user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) { return next(new AppError(404, 'There is no user with this username.')) }

  }


  else {
    return next(new AppError(404, 'User Not Found'));
  }

  // 2) Generate the random reset token
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email

  try {
    const url = `${process.env.URL}/reset/${resetToken} `;
    await new Email(user, url).sendResetPasswordMail();


    res.status(200).json({
      status: 'ok',
      data: 'Token sent to your Email!'
    });


  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(500, 'There was an error sending the email. Try again later!')
    );

  }

});



exports.resetPassword = catchAsync(async (req, res, next) => {


  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) return next(new AppError(401, 'Confirm password is not the same'))

  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');


  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError(400, 'Token is invalid or has expired'));
  }
  // 2) If token has not expired, and there is user, set the new password

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 3) Update changedPasswordAt property for the user

  await user.save();

  // 4) Log the user in, send JWT
  createSendToken(user._id, res);
});





exports.messagePopup = catchAsync(async (req, res, next) => {

  const { userId } = req;

  // Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) return next(new AppError(400, 'This route is not for password updates. Please use /messagePopup.'))


  const user = await UserModel.findById(userId);
  // if (user.newMessagePopup) {
  //   user.newMessagePopup = false;
  // } else {
  //   user.newMessagePopup = true;
  // };
  // await user.save();

  const filteredBody = { newMessagePopup: !user.newMessagePopup }

  //  Update user document
  const userUpdated = await UserModel.findByIdAndUpdate(userId, filteredBody, {
    new: true,
    runValidators: false
  });


  res.status(200).json({
    status: 'ok',
    // data: userUpdated
  });
});


