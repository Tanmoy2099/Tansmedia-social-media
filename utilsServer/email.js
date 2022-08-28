const nodemailer = require('nodemailer');
const appName = require('./appName');

module.exports = class Email {
  constructor(user, url) {

    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }


  newTransport() {

    // Sendgrid
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  }


  // Send the actual email
  async send(subject, text, html) {

    // 2) Define email options
    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      text,
      html,
    };



    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);

  }


  async sendWelcome() {
    await this.send('welcome', `Welcome to ${appName()}!`);
  }
  async passwordUpdated() {

    const subject = 'Password Changed';
    const text = 'password is Updated successfully!'
    const html = `<h2> your password is updated sucessfully! ${appName()}</h2>`

    await this.send(subject, text, html);
  }
  async profileUpdated(dataType='Profile') {

    const subject = `${dataType} Changed`;
    const text = 'Hey, Your profile data is updated successfully!'
    const html = `<h2> Hey, Your profile data is updated successfully! ${appName()}</h2>`

    await this.send(subject, text, html);
  }

  async sendResetPasswordMail() {

    const subject = `${appName()} reset your password `;
    const text = `Password reset token link is given below /n ${this.url}`;

    const html = ` <h3> Hey, ${this.firstName} </h3>
    <h4> Password reset token link is given below </h4>
      <a style={text-decoration:'none'} href=${this.url} > Click here to reset password </a>
      <p> This token is valid for 30 minutes</p>
      <p> Ignore the email if you have not requested for the reset password </p>
      `;

    await this.send(subject, text, html);
  }

};
