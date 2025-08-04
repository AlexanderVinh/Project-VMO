// services/mail.service.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendEmail = async ({ to, subject, content }) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to,
    subject,
    html: content,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Send mail failed:', error);
  }
};
