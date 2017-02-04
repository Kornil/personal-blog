var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  google: Schema.Types.Mixed,
  username: String,
  email: String,
  picture: String,
  admin: Boolean
});

module.exports = mongoose.model('User', User);