const userModel = require('../models/UserModel');
const {isEmailValid} = require('../utils/validation');
const bcrypt = require('bcrypt');
require('../db')
require('dotenv').config();
const {SECRET_TOKEN} = process.env;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')



// module.exports.signup_get = (req, res) => {
//    res.render('signup');
// }

// module.exports.login_get = (req, res) => {
//    res.render('signup');
// }


module.exports.signup_post = async(req, res) => {
   const {email, password} = req.body
   if(!email || !password){
      res.status(422).json({err: "Missing data"})
   }
   if(!isEmailValid(email)){
      return res.status(400).send({message:"Invalid email!"});
   }

   const hashedPassword = await bcrypt.hash(password, 12);
   const newUser = new userModel({email, hashedPassword});

   userModel.findOne({email})
   .then((data) => {
      if(data){
         return res.status(409).send({message:'Email already in use!'});
      }
      else{
         newUser.save()
         .then((data) => {
            const maxAge = 60 * 60 * 24 * 3;
            const token = jwt.sign({id: data._id},SECRET_TOKEN, {expiresIn: maxAge});
            res.cookie('jwt', token,  {httpOnly: true, maxAge: maxAge*1000});
            return res.status(200).json({message: "Signed up successfully"});
         })
         .catch((err) => {
            res.status(400).json({error: err});
         })
      }
   })
   .catch((err) => {
      res.status(400).json({error: err});
   })
}


module.exports.login_post = (req,res) => {
   const {email, password} = req.body
   if(!email || !password){
      res.status(422).json({err: 'Missing data'});
   }
   if(!isEmailValid(email)){
      res.status(400).json({message: 'Invalid Email'});
   }

   blogModel.findOne({email})
   .then((data) => {
      if(!data){
         res.status(401).json({error: "Email not registered"});
      }
      else{
         bcrypt.compare(password, data.password)
         .then((valid) => {
            if(!valid){
               res.status(401).json({error: "Invalid Email or Password"});
            }
            else{
               // create a cookie and send it to the client
               const maxAge = 60 * 60 * 24 * 3;
               const  token = jwt.sign({id: data._id}, SECRET_TOKEN , { expiresIn :maxAge });
               res.cookie('jwt',token, {httpOnly: true, maxAge: maxAge*1000});
               res.status(200).json({message: `Logged In Successfully as ${data.email}`});
            }
         })
         .catch((err) => {
            res.status(400).json({error: err});
         })
      }
   })
   .catch((err) => {
      res.json({error: err});
   })
}

module.exports.logout_get = (req, res) => {
   res.cookie('jwt', '', {maxAge: 1});
   res.status(200).json({message:'User Logged Out!'});
}