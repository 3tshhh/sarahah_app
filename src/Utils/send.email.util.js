import nodemailer from "nodemailer";
import EventEmitter from "events";
import { log } from "console";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
});


const otpEmitter = new EventEmitter();

otpEmitter.on("sendEmail", (to, subject, template) => {
  transporter.sendMail({
    from: "Sarahah App",
    to,
    subject,
    html: template,
  });
});


export const sendEmail = async ({to, subject ,template}) => {
  otpEmitter.emit(
    "sendEmail",
    to,
    subject,
    template
  );
};
