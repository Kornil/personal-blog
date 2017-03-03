const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Article = new Schema({
  title: String,
  heading: String,
  image: String,
  text: String,
  author: String,
  date: String,
  tags: [String],
  comments: [Schema.Types.Mixed],
  likes: Number,
  likedBy: [String],
});

module.exports = mongoose.model('Article', Article);
