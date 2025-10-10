import { emailSubjects, emailTemplates, resetUrl } from "./strings.constants.js";
import fs from "node:fs";
export const OTPEmailHTML = (OTP) => {
  return {
    subject: emailSubjects.CONFIRM_OTP,
    template: fs
      .readFileSync(emailTemplates.OTP)
      .toString()
      .replace(/{{\s*OTP\s*}}/g, OTP.toUpperCase())
  };
};




export const resetPasswordEmailLinkHTML = (token) => {
  return {
    subject: emailSubjects.CONFIRM_OTP,
    template: fs
  .readFileSync(emailTemplates.RESET_PASSWORD)
  .toString()
  .replace(/{{VERIFICATION_LINK}}/g, `${resetUrl}${token}`)
  };
}
