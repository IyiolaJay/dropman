require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require('path')
const ejs = require('ejs');


const templatePath = path.join(__dirname, "..", "template", "email.ejs");

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
    const html = await ejs.renderFile(templatePath, { token: mailBody.token, name : "hammed" });
    const mail = await Transport.sendMail({
      from: process.env.USER,
      to: mailBody.to,
      subject: mailBody.subject,
      html: html,
    });
    return mail;
  } catch (error) {
    const err = new Error(error);
    err.statusCode = 500;
    throw err;
    // next(err);
  }
};


