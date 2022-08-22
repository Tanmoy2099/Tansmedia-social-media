
const { Schema, model } = require('mongoose');
// const Schema = mongoose.Schema;

const NotificationSchema = new Schema({

  user: { type: Schema.Types.ObjectId, ref: 'User' },

  notifications: [
    {
      type: { type: String, enum: ['newLike', 'newComment', 'newFollower'] },
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      post: { type: Schema.Types.ObjectId, ref: 'Post' },
      commentId: { type: String },
      text: { type: String },
      date: { type: Date, default: Date.now }
    }
  ]

});

const Notification = model('Notification', NotificationSchema);

module.exports = Notification;