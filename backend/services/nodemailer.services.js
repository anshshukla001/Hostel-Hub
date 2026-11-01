const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false,
  },
});


const sendEmail = (to, subject, html) => {
  if (!process.env.EMAIL || !process.env.EMAIL_PASS) {
    console.warn("Email skipped: EMAIL and EMAIL_PASS are not configured.");
    return Promise.resolve({ skipped: true });
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
