import * as utils from "../index.js";
import * as redis from "../../DB/Models/Redis/index.js";
import { v4 as uuidv4 } from "uuid";
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

export const resetPasswordLinkEmail = async (email, _id) => {
  const token = utils.encrypt(utils.generateToken({ _id }, "15m"));
  const uniqueString = uuidv4().padEnd(15);
  utils.sendEmail({ to: email, ...resetPasswordEmailLinkHTML(uniqueString) });
  return await utils.setRedisKey(
    redis.OTPRedisModel.key(uniqueString, redis.OTPRedisModel.types.RESET),
    token,
    redis.OTPRedisModel.ttl
  );
};
