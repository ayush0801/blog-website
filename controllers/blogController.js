const blogModel = require('../models/BlogModel');
const isEmailValid = require('../utils/validation');
require('../db');


module.exports.all_posts_get = async(req, res) => {
   try{
      const blogs = await(blogModel.find()); 
      return res.status(200).json({blogs});
   }
   catch(err){
      res.status(404).json(err);
   }
}

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