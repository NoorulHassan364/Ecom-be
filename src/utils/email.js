const nodemailer = require("nodemailer");
const ejs = require('ejs');
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email,
      this.name = user.name,
      this.from = 'noor.hassan@dmechs.com',
      this.url = url
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SEND_GRID_USER_NAME,
        pass: process.env.SEND_GRID_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = await ejs.renderFile(`${__dirname}/../emailTemplates/${template}.ejs`, { name: this.name, url: this.url, subject });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html: html,
      text: htmlToText.fromString(html),
    };
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to our tours')
  }

  async passwordReset() {
    await this.send('passwordReset', 'your password reset token (valid for 10min)')
  }
}



// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_port,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: "Noor ul Hassan <noor.hassan.io>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
