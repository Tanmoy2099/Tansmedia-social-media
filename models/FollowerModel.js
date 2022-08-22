
const { model, Schema } = require('mongoose');


const FollowerSchema = new Schema({

  user: { type: Schema.Types.ObjectId, ref: 'User' },

  followers: [{ user: { type: Schema.Types.ObjectId, ref: 'User' } }],

  following: [{ user: { type: Schema.Types.ObjectId, ref: 'User' } }],

});

const Follower = model('Follower', FollowerSchema);

module.exports = Follower;