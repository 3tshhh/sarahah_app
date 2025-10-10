import * as utils from "../index.js";
import * as redis from "../../DB/Models/Redis/index.js";
import jwt from "jsonwebtoken";
import {
  OTPEmailHTML,
  resetPasswordEmailLinkHTML,
} from "../../Constants/email.templates.js";

export const BlackListToken = async ({ tokenId, expirationDate, userId }) => {
  return await utils.setRedisKey(
    redis.BlackListedTokenRedisModel.key(tokenId),
    userId,
    Number(expirationDate)
  );
};

export const createSendOTPEmail = async (email, type) => {
  const otp = utils.createOTP().toLowerCase();
  utils.sendEmail({ to: email, ...OTPEmailHTML(otp) });
  return await utils.setRedisKey(
    redis.OTPRedisModel.key(email, type || redis.OTPRedisModel.types.CONFIRM),
    utils.hash(otp),
    redis.OTPRedisModel.ttl
  );
};

export const resetPasswordLinkEmail = async (email) => {
  const token = utils.generateToken({ email }, "15m");
  const encryptedToken = utils.encrypt(token);

  utils.sendEmail({ to: email, ...resetPasswordEmailLinkHTML(encryptedToken) });
};
