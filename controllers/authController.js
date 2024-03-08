const userModel = require('../models/UserModel');
const {isEmailValid} = require('../utils/validation');
const bcrypt = require('bcrypt');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
require('../db')
require('dotenv').config();
const {SECRET_TOKEN} = process.env;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')


let otpDoc; 

// Function to send a verification email
const sendVerificationEmail = async (email) => {
   const generateVerificationOTP = () => {
      const length = 6;
      const buffer = crypto.randomBytes(length);
      const otp = buffer.toString("hex").slice(0, length).toUpperCase();
      return otp;
   };

   const verificationOTP = generateVerificationOTP();

   const otpSchema = require("../models/otpModel");
   otpDoc = new otpSchema({ email, otp: verificationOTP });
   await otpDoc.save();

   await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
      <p>Here is your OTP code: ${verificationOTP}</p>`
   );
};

const sendConformationEmail = (email) => {
   mailSender(
      email,
      "Confirmation Email",
      `<h1>Your Email has been successfully verified</h1>
      <p>You can now login into our system.</p>`
   );
};

// Function to verify OTP
const verifyOTP = async (email, otp) => {
   const otpSchema = require("../models/otpModel");

   try {
      otpDoc = await sendVerificationEmail(email); // Wait for sendVerificationEmail to complete

      const otpCheck = await otpSchema.findOne({ email, otp });
      if (!otpCheck) {
         return false; // Invalid OTP
      }

      const user = await userModel.findOneAndUpdate(
         { email },
         { isVerified: true },
         { new: true }
      );

      if (otpDoc) {
         await otpDoc.remove(); // Remove the used OTP document if it exists
      }

      return true; // OTP verified successfully
   } catch (error) {
      console.error(error);
      return false; // Error during OTP verification
   }
};


module.exports.signup_post = async (req, res) => {
   const { email, password, isVerified } = req.body;
   if (!email || !password) {
     res.status(422).json({ err: "Missing data" });
   }
   if (!isEmailValid(email)) {
     return res.status(400).send({ message: "Invalid email!" });
   }
 
   const hashedPassword = await bcrypt.hash(password, 12);
   const newUser = new userModel({ email, password: hashedPassword, isVerified });
 
   try {
     const existingUser = await userModel.findOne({ email });

   //   console.log(existingUser.email, existingUser.password, existingUser.isVerified);
 
     if (existingUser) {
       if(existingUser.isVerified){
         return res.status(409).send({ message: "Email already in use!" });
       }
       else{
         await sendVerificationEmail(email);
         return res.status(400).send({message:"Email ID has already been used but account has not been verified. A verification email has been sent again to you email. Please verify your account first."});
       }
     } 
 
     const data = await newUser.save();

     // Call the function to send a verification email
      await sendVerificationEmail(email);
 
     const maxAge = 60 * 60 * 24 * 3;
     const token = jwt.sign({ id: data._id }, SECRET_TOKEN, { expiresIn: maxAge });
     res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
     return res.status(200).json({ message: "User has been signed up and verification email sent successfully" });
   } catch (err) {
      console.log(err);
     res.status(400).json({ error: err.message });
   }
 };



 module.exports.verify_otp = async (req, res) => {
   const { email, otp } = req.body;

   const otpVerified = await verifyOTP(email, otp);

   if (otpVerified) {
      await sendConformationEmail(email);
      res.status(200).json({ message: "Account Verified Successfully" });
   } else {
      res.status(400).json({ message: "An error occurred during verification! Please try again later." });
   }
};


module.exports.login_post = async (req, res) => {
   const { email, password } = req.body;
   if (!email || !password) {
      res.status(422).json({ err: 'Missing data' });
   }
   if (!isEmailValid(email)) {
      res.status(400).json({ message: 'Invalid Email' });
   }

   try {
      const existingUser = await userModel.findOne({ email });

      // console.log(existingUser.email, existingUser.password, existingUser.isVerified);
      if (!existingUser) {
         res.status(401).json({ error: 'Email not registered' });
      } else {
         if (!existingUser.isVerified) {
            await sendVerificationEmail(email);
            return res.status(400).json({ error: 'Your account is not verified. A verification email has been sent again to your email. Please verify your account first.' });
         } else {
            bcrypt.compare(password, existingUser.password)
               .then((valid) => {
                  if (!valid) {
                     res.status(401).json({ error: 'Invalid Email or Password' });
                  } else {
                     // create a cookie and send it to the client
                     const maxAge = 60 * 60 * 24 * 3;
                     const token = jwt.sign({ id: existingUser._id }, SECRET_TOKEN, { expiresIn: maxAge });
                     res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                     res.status(200).json({ message: `Logged In Successfully as ${existingUser.email}` });
                  }
               })
               .catch((err) => {
                  return res.json(err);
               });
         }
      }
   } catch (err) {
      console.log(err);
      res.status(400).json({ error: err });
   }
};


module.exports.logout_get = (req, res) => {
   res.cookie('jwt', '', {maxAge: 1});
   res.status(200).json({message:'User Logged Out!'});
}