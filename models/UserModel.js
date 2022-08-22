const crypto = require('crypto');
const { Schema, model, models } = require('mongoose');

const bcrypt = require('bcryptjs');




const UserSchema = new Schema({
  name: { type: String, required: true },

  username: { type: String, required: true, unique: true, trim: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true, select: false },

  confirmPassword: {
    type: String, required: [true, 'Please confirm your password'], validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },

  profilePicUrl: { type: String },

  about: { type: String },

  newMessagePopup: { type: Boolean, default: true },

  unreadMessage: { type: Boolean, default: false },

  unreadNotification: { type: Boolean, default: false },

  role: { type: String, default: 'user', enum: ['user', 'root'] },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  expireToken: { type: Date },

},
  // { timestamps: true }
);




UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; //sometime it happans that ths token is created after forgotPassword has created, so reducing the time by 1s
  // It ensured token is created after the password has changed.
  next();
});


UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(6).toString('hex');
  // const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};


const User = model('User', UserSchema);

module.exports = User;
