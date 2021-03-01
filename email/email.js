const nodemailer = require('nodemailer');
smtpTransport = require('nodemailer-smtp-transport');
const dotenv = require('dotenv');

dotenv.config();

function sendEmail(verificationToken, email) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'natalibc123@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: 'natalibc123@gmail.com',
    to: email,
    subject: 'Nodemailer test',
    html:
      '<a href=`http://localhost:8080/auth/verify/:${verificationToken}`>Перейдите по ссылке для подтверждения e-mail</a>',
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { sendEmail };
