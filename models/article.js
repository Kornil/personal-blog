var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Article = new Schema({
  title: String,
  image: String,
  text: String,
  author: String,
  date: String,
  tags: [String],
  comments: [Schema.Types.Mixed],
  likes: Number,
  likedBy: [String]
});

module.exports = mongoose.model('Article', Article);