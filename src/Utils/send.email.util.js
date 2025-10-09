import nodemailer from "nodemailer";
import fs from "node:fs";
import EventEmitter from "events";
import {
  OTPTemplate,
  passwordResetTemplate,
  resetUrl,
} from "../Constants/strings.constants.js";

const otpEmitter = new EventEmitter();

otpEmitter.on("sendEmail", (to, subject, otp) => {
  let html
  if (otp.includes("reset-password")) {
    const token = otp.split(" ")[1];
    html = fs.readFileSync(passwordResetTemplate)
      .toString()
      .replace(/{{VERIFICATION_LINK}}/g, `${resetUrl}${token}`);
  } else {
    html = fs.readFileSync(OTPTemplate).toString().replace(/{{\s*OTP\s*}}/g, otp.toUpperCase());
  }

  const mailOptions = {
    from: 'Sarahah App',
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions);
});

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

export const sendOTPEmail = async (to, subject, otp) => {
  otpEmitter.emit("sendEmail", to, subject, otp);
};
