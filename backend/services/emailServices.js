require("dotenv").config();
const nodemailer = require("nodemailer");

const Transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
  tls: { rejectUnauthorized: false },
});

exports.sendToMail = async (mailBody) => {
  try {
    const mail = await Transport.sendMail({
      from: process.env.USER,
      to: mailBody.to,
      subject: mailBody.subject,
      html: `<p>Your account has been created successfully</p>
            <p>Welcome to Dropman</p>
          `,
    });
    return mail;
  } catch (error) {
    const err = new Error(error);
    err.statusCode = 500;
    throw err;
    // next(err);
  }
};
