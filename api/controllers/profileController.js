const FollowerModel = require("../../models/FollowerModel");
const PostModel = require("../../models/PostModel");
const UserModel = require("../../models/UserModel");
const catchAsync = require("../../utilsServer/catchAsync");
const AppError = require("../../utilsServer/customError");

const { newFollowerNotification, removeFollowerNotification } = require('../../utilsServer/notificationActions');


exports.getProfileData = catchAsync(async (req, res, next) => {

  const { username } = req.params;

  const profile = await UserModel.findOne({ username: username.toLowerCase() });
  if (!profile) return next(new AppError(404, 'User Not Found'));

  const profileFollowStats = await FollowerModel.findOne({ user: profile._id });

  const followerLength = profileFollowStats.followers.length > 0 ? profileFollowStats.followers.length : 0;
  const followingLength = profileFollowStats.following.length > 0 ? profileFollowStats.following.length : 0;

  res.status(200).json({
    status: 'ok',
    data: {
      profile,
      followerLength,
      followingLength
    }
  });
});

exports.getProfileDataForAPost = catchAsync(async (req, res, next) => {

  const { username } = req.params;


  const user = await UserModel.findOne({ username: username.toLowerCase() });
  if (!user) return next(new AppError(404, 'User Not Found'));

  const posts = await PostModel.find({ user: user._id })
    .sort({ createAt: -1 })
    .populate("comments.user");

  res.status(200).json({
    status: 'ok',
    total: posts.length,
    data: posts
  });
});

exports.getFollowers = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await FollowerModel.findOne({ user: userId })
    .populate('followers.user')

  res.status(200).json({
    status: 'ok',
    data: user.followers
  });
});


exports.getFollowing = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await FollowerModel.findOne({ user: userId })
    .populate('following.user')

  res.status(200).json({
    status: 'ok',
    data: user.following
  });
});

exports.followAUser = catchAsync(async (req, res, next) => {

  const { userId } = req;
  const { userToFollowId } = req.params;


  const user = await FollowerModel.findOne({ user: userId });
  const userToFollow = await FollowerModel.findOne({ user: userToFollowId });

  if (!user || !userToFollow) return next(new AppError(404, 'User Not Found'));

  const isFollowing = await user.following.length > 0 && user.following.filter(following => following.user.toString() === userToFollowId).length > 0;

  if (isFollowing) return next(new AppError(401, 'User already followed'));

  await user.following.unshift({ user: userToFollowId });
  await user.save();

  await userToFollow.followers.unshift({ user: userId });
  await userToFollow.save();

  await newFollowerNotification(userId, userToFollowId);

  res.status(200).json({
    status: 'ok'
  });
});

exports.unFollowAUser = catchAsync(async (req, res, next) => {

  const { userId } = req;
  const { userToUnfollowId } = req.params;

  const user = await FollowerModel.findOne({ user: userId });
  const userToUnfollow = await FollowerModel.findOne({ user: userToUnfollowId });

  if (!user || !userToUnfollow) return next(new AppError(404, 'User Not Found'));

  const isFollowing = user.following.length > 0 && user.following.filter(following => following.user.toString() === userToUnfollowId).length === 0;

  if (isFollowing) return next(new AppError(401, 'User not followed previously'));

  const removeFollowing = await user.following.map(following => following.user.toString()).indexOf(userToUnfollowId);

  await user.following.splice(removeFollowing, 1);
  await user.save();

  const removeFollower = await userToUnfollow.followers.map(follower => follower.user.toString()).indexOf(userId);

  await userToUnfollow.followers.splice(removeFollower, 1);
  await userToUnfollow.save();

  await removeFollowerNotification(userId, userToUnfollowId);

  res.status(200).json({
    status: 'ok'
  });
});

