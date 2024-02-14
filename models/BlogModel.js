const mongoose = require('mongoose');
require('../db');

const postSchema = new mongoose.Schema({
   title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title should be minimum 3 characters long"]
   },
   body: {
      type: String,
      required: [true, "Body is required"],
      minlength: [10,"The description should be minimum 10 characters long" ]
   },
   date: {
      type: Date,
      default: Date.now()
   },
   tags: {
      type: [String]
   }

})


const postModel = mongoose.model('Blog', postSchema);

module.exports = postModel;