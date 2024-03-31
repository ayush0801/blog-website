const mongoose = require('mongoose');
require('../db');

const commentSchema = new mongoose.Schema({
   content: {
      type: String,
      required: [true, "Body is requried"],
      minlength: [10, "The comment should be minimum 10 characters long"]
   },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required:  true
   },
   likes: {
      type:  [mongoose.Schema.Types.ObjectId],
      default:  []
   },
   replies: [{
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'user',
         required: true
      },
      content: {
         type: String,
         required: [true, "Body is requried"],
         minlength: [10, "The comment should be minimum 10 characters long"]         
      },
      
      date: {
         type: Date,
         default: Date.now()
      }
   }],
   date: {
      type: Date,
      default: Date.now()
   }
});

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
   },
   comments: [commentSchema]

});




const postModel = mongoose.model('Blog', postSchema);

module.exports = postModel;