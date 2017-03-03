const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
  google: Schema.Types.Mixed,
  username: String,
  email: String,
  picture: String,
  admin: Boolean,
});

module.exports = mongoose.model('User', User);
