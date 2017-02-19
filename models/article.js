var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Article = new Schema({
  title: String,
  subtitle: String,
  image: String,
  text: String,
  author: String,
  date: String
});

module.exports = mongoose.model('Article', Article);