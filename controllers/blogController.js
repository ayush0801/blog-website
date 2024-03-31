const blogModel = require('../models/BlogModel');
const isEmailValid = require('../utils/validation');
require('../db');
const authRoutes = require('../router/authRoute');

// GET all Posts with optional search
module.exports.all_posts_get = async (req, res) => {
   try {
     const searchQuery = req.query.q;
 
     let query = {};
     if (searchQuery) {
       query.title = { $regex: new RegExp(searchQuery, 'i') };
     }
 
     const blogs = await blogModel.find(query);
 
     return res.status(200).json({ blogs });
   } catch (err) {
     res.status(500).json({ error: err.message });
   }
 };


//GET a particular Post
module.exports.get_particular_blog_get =  async (req,res) => {
   const blogID = req.params.id;
   try {
    const blog = await blogModel.findById(blogID)
       .populate({
          path: 'comments',
          populate: {
             path: 'replies',
             populate: {
                path: 'user', // Assuming you want to populate the user field in replies
                select: 'username' // Select specific fields of the user
             }
          }
       });
    if (!blog) {
       return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ blog });
 } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
 }
}

//Create a Post
module.exports.add_blog_post = async(req, res) => {
   const {title, body, date, tags, comments} = req.body
   if(!title || !body){
      res.status(403).json( {"Error": "Please fill out all fields."} );
   }
   try{
      const blog = new blogModel({title, body, date, tags, comments});
      await blog.save();
      res.status(201).json({message:  'Post added successfully with ID:' + blog._id});
   }
   catch(err){
      res.status(500).send({error: err.message});
   }
}

//Update a Post
module.exports.update_post = async (req, res) => {
   const blogId = req.params.id;
   const thingsToUpdate = {};
   const { title, body, tags } = req.body;
 
   if (title && body && tags) {
     if (title.length < 3) {
       return res.status(422).json({ error: "Title should be at least 3 characters" });
     }
     if (body.length < 10) {
       return res.status(422).json({ error: "Body should be at least 10 characters" });
     }
     if (tags.length === 0) {
       return res.status(422).json({ error: 'Add at least one tag' });
     }
     thingsToUpdate.title = title;
     thingsToUpdate.body = body;
     thingsToUpdate.tags = tags;
   } else if (title) {
     if (title.length < 3) {
       return res.status(422).json({ error: "Title should be at least 3 characters" });
     }
     thingsToUpdate.title = title;
   } else if (body) {
     if (body.length < 10) {
       return res.status(422).json({ error: "Body should be at least 10 characters" });
     }
     thingsToUpdate.body = body;
   } else if (tags) {
     if (tags.length === 0) {
       return res.status(422).json({ error: 'Add at least one tag' });
     }
     thingsToUpdate.tags = tags; // Use $set to update the entire tags array
   } else {
     return res.status(422).json({ error: "Please fill at least one field" });
   }
 
   blogModel.findOneAndUpdate({ _id: blogId }, thingsToUpdate)
     .then((data) => {
       if (!data) {
         res.json('Data not found');
       } else {
         res.status(200).json('Data updated successfully');
       }
     })
     .catch((err) => {
       res.status(400).json({ error: err });
     });
 };
 
 

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