const mongoose = require('mongoose');
const mailsender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
   email: {
      type: String,
      required: true,
      trim: true
   },
   otp: {
      type: String,
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 10
   }
});

async function sendVerificationMail(email, otp) {
   try {
      const mailResponse = await mailsender(
         email,
         "Verification Email",
         `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
      );
      console.log("Email sent successfully!", mailResponse);
   } catch (error) {
      console.log("Error occurred while sending email:  ", error);
   }
}


otpSchema.pre("save", async function (next) {
   console.log("New document saved to the database");
   if (this.isNew) {
     await sendVerificationMail(this.email, this.otp);
   }
   next();
 });

 const otpModel = mongoose.model( "Otp", otpSchema );
 module.exports = otpModel;