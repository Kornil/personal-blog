var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  google: Schema.Types.Mixed,
  //name: String,
  username: String,
  email: String,
  picture: String
});

module.exports = mongoose.model('User', User);