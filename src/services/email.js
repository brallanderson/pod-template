const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'Yahoo',
  auth: {
    user: 'dtibooks@yahoo.com',
    pass: '1406@1406'
  }
});

let message = {
  from: 'dtibooks@yahoo.com',
  to: 'noob317@gmail.com',
  subject: 'Nodemailer is unicode friendly ✔',
  text: 'Hello to myself!',
  html: '<p><b>Hello</b> to myself!</p>'
};

transporter.sendMail(message, (err, info) => {
  if (err) {
    console.log('Error occurred. ' + err.message);
    return process.exit(1);
  }

  console.log('Message sent: %s', info.messageId);
});
