

const nodemailer = require('nodemailer');
// const sendGridTransport = require('nodemailer-sendgrid-transport');
const appName = require('./appName');
const { pureBaseUrl } = require('../utils/baseUrl');

const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey('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')

// const options = {
//     auth: { api_key: process.env.SENDGRID_API }
// }

// const transporter = nodemailer.createTransport(sendGridTransport(options));
// const transporter = () => nodemailer.createTransport({
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });


// const sendMail = async (userEmail, subject, text, html) => {

//   const msg = {
//     to: userEmail,
//     from: `${appName} <${process.env.EMAIL_FROM}>`,
//     subject,
//     text,
//     html
//   }

//   // try {
//   // const res = await
//   transporter()
//     .sendMail(msg)
//     .then(() => {
//       console.log('Email sent')
//       return true
//     })
//     .catch((error) => {
//       console.error(error)
//       return false
//     })


//   //   if (res.code > 400) {
//   //     throw res
//   //   }
//   //   return true
//   // } catch (error) {
//   //   console.log(error.message)
//   //   return false
//   // }


// }

const msg = (userEmail, subject, text, html) => ({
  to: userEmail,
  from: { name: `${appName}`, email: process.env.EMAIL_FROM },
  subject,
  text,
  html,
})



exports.sendResetPasswordMail = (name, userEmail, resetToken) => {

  const subject = `${appName} reset your password `;
  const text = `Password reset token link is given below /n ${pureBaseUrl}/reset/${resetToken}`;

  const html = ` <h2> Hey, ${name.split(' ')[0]} </h2>
  <h4> Password reset token link is given below </h4>
    <a style={text-decoration:'none}> ${pureBaseUrl}/reset/${resetToken} </a>
    <p> This token is valid for 30 minutes</p>
    <p> Ignore the email if you have not requested for the reset password </p>
    `;

  // return await sendMail(userEmail, subject, text, html);


  sgMail
    .send(msg(userEmail, subject, text, html))
    .then(() => {
      console.log('Email sent')
      return true
    })
    .catch((error) => {
      console.error(error.message)
      return false
    })
};

