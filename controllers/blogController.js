const blogModel = require('../models/BlogModel');
const isEmailValid = require('../utils/validation');
require('../db');

//GET all Posts
module.exports.all_posts_get = async(req, res) => {
   try{
      const blogs = await(blogModel.find()); 
      return res.status(200).json({blogs});
   }
   catch(err){
      res.status(404).json(err);
   }
}

//GET a particular Post
module.exports.get_particular_blog_get =  (req,res) => {
   const blogID = req.params.id;
   blogModel.findOne({_id: blogID})
   .then((data) => {
      res.status(200).json({blog: data});

   })
   .catch((err) => {
      return res.status(401).json({error: err.message});

   })
}

//Create a Post
module.exports.add_blog_post = async(req, res) => {
   const {title, body, tags} = req.body
   if(!title || !body){
      res.status(403).json( {"Error": "Please fill out all fields."} );
   }
   try{
      const blog = new blogModel({title, body, tags});
      await blog.save();
      res.status(201).json({message:  'Post added successfully with ID:' + blog._id});
   }
   catch(err){
      res.status(500).send({error: err.message});
   }
}

//Update a Post
module.exports.update_post = async(req,res) => {
   const blogId = req.params.id;
   const thingsToUpdate = {}
   const {title, body, tags} = req.body
   if(title && body){
      if(title.length < 3){
          return res.status(422).json({error: "Title should be atleast 3 characters"})
      }
      if(body.length < 10){
          return res.status(422).json({error: "Body should be atleast 10 characters"})
      }
      thingsToUpdate.title = title
      thingsToUpdate.body = body
   }
   else if(title){
      if(title.length < 3){
          return res.status(422).json({error: "Title should be atleast 3 characters"})
      }
      thingsToUpdate.title = title
   }
   else if(body){
      if(body.length < 10){
          return res.status(422).json({error: "Body should be atleast 10 characters"})
      }
      thingsToUpdate.body = body
   }
   else{
      return res.status(422).json({error: "Please fill any one field"})
   }
   
   blogModel.findOneAndUpdate({_id: blogId}, {$set: thingsToUpdate})
   .then((data) => {
      if(!data){
         res.json('Data not found');
      }
      else{
         res.status(200).json('Data updated successfully');
      }
   })
   .catch((err) => {
      res.status(400).json({error: err})
   })

}

//Delete a Post
module.exports.delete_post = async(req, res) => {
   const blogId = req.params.id;
   blogModel.findOneAndDelete({_id: blogId})
   .then((data) => {
      if(!data){
         console.log(err);
         res.json({error: 'No blog Found'});
      }
      else{
         res.status(200).json({message: 'Post Delete Successfully'});
      }
   })
   .catch((err) => {
      console.log(err);
      res.status(400).json({error: err});
   })
}