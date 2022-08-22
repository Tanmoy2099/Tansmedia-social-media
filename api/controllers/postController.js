
const uuid = require('uuid').v4;

const catchAsync = require('../../utilsServer/catchAsync');
const AppError = require('../../utilsServer/customError');

const UserModel = require('../../models/UserModel');
const PostModel = require('../../models/PostModel');
const FollowerModel = require('../../models/FollowerModel');

const { newLikeNotification, removeLikeNotification, newCommentNotification, removeCommentNotification } = require('../../utilsServer/notificationActions');

exports.createPost = catchAsync(async (req, res, next) => {

  const { text, location, picUrl } = req.body;

  if (text.length < 1) return next(new AppError(401, 'Text must have atleast 1 character'));

  const newPost = { user: req.userId, text };

  if (location) newPost.location = location;
  if (picUrl) newPost.picUrl = picUrl;

  const post = new PostModel(newPost);
  await post.save();

  const postCreated = await PostModel.findById(post._id).populate('user');

  res.status(200).json({
    status: 'ok',
    data: postCreated
  });

});

exports.getAllPost = catchAsync(async (req, res, next) => {

  const { userId } = req;
  const pageNumber = +req.query.pageNumber;

  const size = 5;
  const skips = size * (pageNumber - 1);

  let posts = [];

  const loggedUser = await FollowerModel.findOne({ user: userId }).select("-followers");

  const loggedUsersId = [userId, ...loggedUser.following.map(following => following.user)];

  posts = await PostModel.find({ user: { $in: loggedUsersId } })
    .skip(skips)
    .limit(size)
    .sort({ createdAt: -1 })
    .populate('user')
    .populate('comments.user');

  res.status(200).json({
    status: 'ok',
    total: posts.length,
    data: posts
  })
});

exports.getPostById = catchAsync(async (req, res, next) => {

  const { postId } = req.params;

  const post = await PostModel.findById(postId)
    .populate('user')
    .populate('comments.user');


  if (!post) return next(new AppError(404, 'Post not found'));

  res.status(200).json({
    status: 'ok',
    data: post
  })
});

exports.deletePostById = catchAsync(async (req, res, next) => {

  const { userId } = req;
  const { postId } = req.params;

  const post = await PostModel.findById(postId);
  if (!post) return next(new AppError(404, 'Post not found'));

  const user = await UserModel.findById(userId);

  // if (post.user.toString() !== userId) {
  //   if (user.role !== 'root') return next(AppError(401, 'Unauthorized'));
  //   await post.remove();
  //   return res.status(200).json({
  //     status: 'ok',
  //     data: 'Post deleted Successfully'
  //   })
  // }


  if (!(post.user.toString() === userId || user.role === 'root')) return next(AppError(401, 'Unauthorized'));

  await post.remove();
  res.status(200).json({
    status: 'ok',
    data: 'Post deleted Successfully'
  })
});

exports.likeAPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req;

  const post = await PostModel.findById(postId);
  if (!post) return next(new AppError(404, 'post not found'));

  const isLiked = post.likes.filter(like => like.user.toString() === userId).length > 0;

  if (isLiked) return res.status(401).json({
    status: 'exist',
    data: 'post already liked'
  });

  await post.likes.unshift({ user: userId });
  await post.save();

  const postByUserId = post.user.toString();

  if (postByUserId !== userId) {
    await newLikeNotification(userId, postId, postByUserId);
  }

  res.status(200).json({
    status: 'ok',
    data: 'post liked'
  });
});

exports.unLikeAPost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;
  const { userId } = req;

  const post = await PostModel.findById(postId);
  if (!post) return next(new AppError(404, 'post not found'));

  const isLiked = post.likes.filter(like => like.user.toString() === userId).length === 0;

  if (isLiked) return res.status(401).json({
    status: 'notExist',
    data: 'post not liked before'
  });

  const index = post.likes.map(like => like.user.toString()).indexOf(userId);

  await post.likes.splice(index, 1);
  await post.save();

  const postByUserId = post.user.toString();

  if (postByUserId !== userId) {
    await removeLikeNotification(userId, postId, postByUserId);
  }


  res.status(200).json({
    status: 'ok',
    data: 'post unliked'
  });
});

exports.getAllLikesOfAPost = catchAsync(async (req, res, next) => {

  const { postId } = req.params;
  const post = await PostModel.findById(postId).populate('likes.user');
  if (!post) return next(new AppError(404, 'post not found'));

  res.status(200).json({
    status: 'ok',
    total: post.likes.length,
    data: post.likes
  });
});

exports.createComment = catchAsync(async (req, res, next) => {
  const { userId } = req;
  const { postId } = req.params;
  const { text } = req.body;

  if (text.length < 1) return next(new AppError(401, 'Comment should have atleast 1 character'))


  const post = await PostModel.findById(postId);
  if (!post) return next(new AppError(404, 'post not found'));


  const commentId = uuid();

  const newComment = {
    _id: commentId, text, user: userId
    // date: Date.now(),
  };

  await post.comments.unshift(newComment);
  await post.save();


  const postByUserId = post.user.toString();

  if (postByUserId !== userId) {
    await newCommentNotification(postId, commentId, userId, postByUserId, text);
  }

  res.status(200).json({
    status: 'ok',
    data: newComment._id
  });

});

exports.deleteComment = catchAsync(async (req, res, next) => {

  const { postId, commentId } = req.params;
  const { userId } = req;

  const post = await PostModel.findById(postId);
  if (!post) return next(new AppError(404, 'post not found'));

  const comment = post.comments.find(cmnt => cmnt._id === commentId);
  if (!comment) return next(new AppError(404, 'comment not found'));

  const user = await UserModel.findById(userId);



  const postByUserId = post.user.toString();

  if (postByUserId !== userId) {
    await removeCommentNotification(postId, commentId, userId, postByUserId);
  }

  if (comment.user.toString() !== userId && user.role !== 'root') next(new AppError(401, "Unauthorized"));


  const targetIndex = post.comments.map(cmnt => cmnt._id).indexOf(commentId);
  await post.comments.splice(targetIndex, 1);
  await post.save();

  res.status(200).json({
    status: 'ok',
    data: 'deleted successfully'
  });

});