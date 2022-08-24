const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const uuid = require('uuid').v4;



const newCommentNotification = async (text, postId, commentingUserId) => {

  try {

    if (text.length < 1) return { error: 'Comment should have atleast 1 character' }

    const post = await PostModel.findById(postId);

    if (!post) return { error: "No post found" };
    const postOwnerId = post.user.toString();


    const commentId = uuid();

    const newComment = {
      _id: commentId, text, user: commentingUserId
      // date: Date.now(),
    };

    await post.comments.unshift(newComment);
    await post.save();

    const commentingUser = await UserModel.findById(commentingUserId)

    if (!commentingUser) return { error: 'No valid user commenting' }

    const { name, profilePicUrl, username } = commentingUser;

    return {
      success: true,
      name,
      profilePicUrl,
      username,
      postOwnerId,
      newComment
    };
  } catch (error) {
    return { error: "Server error" };
  }

};


module.exports = { newCommentNotification };