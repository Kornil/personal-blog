var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Article = new Schema({
  title: String,
  text: String,
  author: String,
  date: Number
});

module.exports = mongoose.model('Article', User);