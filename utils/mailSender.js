const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (email, subject, html) => {
  const msg = {
    to: email,
    from: 'ayush.jha.0801@gmail.com',
    subject: subject,
    html: html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error(error);
    throw new Error('Error sending email');
  }
};

module.exports = sendMail;
