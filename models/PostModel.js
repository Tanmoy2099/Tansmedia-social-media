const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  location: String,
  picUrl: String,
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  comments: [
    {
      _id: { type: String, required: true },
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]

}, { timestamps: true });

const Post = model('Post', PostSchema);

module.exports = Post;