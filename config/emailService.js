require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Pastikan koneksi aman
  },
});

// Define the email options
const sendVerification = (email, token, action) => {
  const verifUrl = `http://localhost:${process.env.PORT}/auth/verify_email?email=${email}&token=${token}&action=${action}`;

  const mailOptions = {
    from: process.env.EMAIL, // Sender's email address
    to: email, // Recipient's email address
    subject: "Email Verification", // Subject line
    text: `Hello,
  Please click this link for email verification, expire in 5 minutes: ${verifUrl}`, // Plain text body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = { sendVerification };
