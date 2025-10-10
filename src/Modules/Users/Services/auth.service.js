import { OTPRedisModel, User } from "../../../DB/Models/index.js";
import * as utils from "../../../Utils/index.js";
import { OAuth2Client } from "google-auth-library";
import { ProvidersEnum } from "../../../Common/enums/user.enum.js";
import { v4 as uuidv4 } from "uuid";
export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password, gender, age, phone } = req.body;

  const isEmailExist = await User.findOne({
    email,
    provider: ProvidersEnum.LOCAL,
  });
  if (isEmailExist) {
    return next(new Error("email already exists"));
  }
  const otpSent = await utils.createSendOTPEmail(email);
  if (!otpSent) {
    return next(new Error("Please try again"));
  }

  const user = new User({
    firstName,
    lastName,
    email,
    password: utils.hash(password),
    gender,
    age,
    phone: utils.encrypt(phone),
    isConfirmed: false,
    provider: ProvidersEnum.LOCAL,
  });
  await user.save();
  res.status(201).json({ message: "account created successfully", user });
};

export const confirmAccount = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }, "-password -__v");
  if (!user) {
    return next(new Error("Invalid email or otp"));
  }
  if (user.isConfirmed) {
    return next(new Error("Account already confirmed"));
  }
  const hashedOTP = await utils.getOTPFromRedis(
    email,
    OTPRedisModel.types.CONFIRM
  );
  if (!hashedOTP) {
    return next(new Error("OTP expired"));
  }
  if (!utils.compareHash(otp.toLowerCase(), hashedOTP)) {
    return next(new Error("Invalid email or otp"));
  }

  user.isConfirmed = true;
  await utils.deleteOTPFromRedis(email, OTPRedisModel.types.CONFIRM);
  await user.save();
  res.status(200).json({ message: "email confirmed successfully", user });
};

export const resendConfirmOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Invalid email"));
  }

  if (user.isConfirmed) {
    return next(new Error("Account already confirmed"));
  }
  const otpSent = utils.createSendOTPEmail(email);
  if (!otpSent) {
    return next(new Error("Please try again"));
  }

  res.status(200).json({ message: "otp resent successfully", user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const device = req.deviceInfo;
  const user = await User.findOne({ email, provider: ProvidersEnum.LOCAL });
  if (!user) {
    return next(new Error("Invalid email or password"));
  }
  if (!utils.compareHash(password, user.password)) {
    return next(new Error("Invalid email or password"));
  }
  if (!user.isConfirmed) {
    return next(new Error("Please confirm your email"));
  }
  if (!user.devices.includes(device)) {
    if (user.devices.length < 2) {
      user.devices.push(device);
      await user.save();
    } else {
      return next(
        new Error("Login limit reached. You can only log in from 2 devices.")
      );
    }
  }
  const accesstoken = utils.generateToken(
    { _id: user._id },
    process.env.JWT_ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = utils.generateToken(
    { _id: user._id },
    process.env.JWT_REFRESH_TOKEN_EXPIRE
  );
  res.status(200).json({
    message: "login successfully",
    accesstoken,
    refreshToken,
  });
};

export const refreshToken = async (req, res, next) => {
  const { refreshtoken } = req.headers;
  if (!refreshToken) {
    return next(new Error("refresh token is required"));
  }
  const decoded = utils.verifyToken(refreshtoken);

  const accesstoken = utils.generateToken(
    { _id: decoded._id },
    process.env.JWT_ACCESS_TOKEN_EXPIRE
  );
  res.status(200).json({
    message: "token refreshed successfully",
    accesstoken,
  });
};

export const logout = async (req, res) => {
  const { userToken } = req;
  const blacklistedToken = await utils.BlackListToken(userToken);
  res.status(200).json({ message: "logout successfully", blacklistedToken });
};

export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!utils.compareHash(oldPassword, user.password)) {
    return next(new Error("Invalid old password"));
  }
  if (newPassword === oldPassword) {
    return next(new Error("New password must be different from old password"));
  }
  user.password = utils.hash(newPassword);
  await user.save();
  res.status(200).json({
    message: "password updated successfully",
    user,
  });
};

export const forgotPasswordLink = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Invalid email"));
  }
  await utils.resetPasswordLinkEmail(email, user._id);
  res.status(200).json({ message: "otp sent to your email", user });
};

export const forgotPasswordOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Invalid email"));
  }
  const otpSent = await utils.createSendOTPEmail(email, OTPRedisModel.types.RESET);
  if (!otpSent) {
    return next(new Error("Please try again"));
  }
  res.status(200).json({ message: "otp sent to your email", user });
};

export const resetPasswordWithLink = async (req, res, next) => {
  const linkToken = req.params.token;
  const token = await utils.getOTPFromRedis(
    linkToken,
    OTPRedisModel.types.RESET
  );  
  if (!token) {
    return next(new Error("Invalid or expired link"));
  }
  const decrypted = utils.decrypt(token);
  const { _id } = utils.verifyToken(decrypted);
  const { newPassword } = req.body;
  const user = await User.findById(_id);
  if (!user) {
    return next(new Error("Invalid token"));
  }
  if (utils.compareHash(newPassword, user.password)) {
    return next(new Error("New password must be different from old password"));
  }
  user.password = utils.hash(newPassword);
  await utils.deleteOTPFromRedis(linkToken, OTPRedisModel.types.RESET);
  await user.save();
  res.status(200).json({ message: "password reset successfully", user });
};

export const resetPasswordWithOTP = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Invalid email or otp"));
  }
  const hashedOTP = await utils.getOTPFromRedis(
    email,
    OTPRedisModel.types.RESET
  );
  if (!hashedOTP) {
    return next(new Error("OTP expired"));
  } 
  if (!utils.compareHash(otp.toLowerCase(), hashedOTP)) {
    return next(new Error("Invalid email or otp"));
  }
  if (utils.compareHash(newPassword, user.password)) {
    return next(new Error("New password must be different from old password"));
  }
  user.password = utils.hash(newPassword);
  await utils.deleteOTPFromRedis(email, OTPRedisModel.types.RESET);
  await user.save();
  res.status(200).json({ message: "password reset successfully", user });
}

export const authServiceGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,
  });
  const { email, given_name, family_name, email_verified, sub } =
    ticket.getPayload();
  if (!email_verified) {
    return res.status(400).json({ message: "email not verified" });
  }
  const isUserExist = await User.findOne({
    googleSub: sub,
    provider: ProvidersEnum.GOOGLE,
  });

  let newUser;
  if (!isUserExist) {
    newUser = await User.create({
      firstName: given_name,
      lastName: family_name || " ",
      email,
      provider: ProvidersEnum.GOOGLE,
      isConfirmed: true,
      password: utils.hash(uuidv4()),
      googleSub: sub,
    });
  } else {
    newUser = isUserExist;
    isUserExist.email = email;
    isUserExist.firstName = given_name;
    isUserExist.lastName = family_name || " ";
    await isUserExist.save();
  }

  const accesstoken = utils.generateToken(
    { _id: newUser._id },
    process.env.JWT_ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = utils.generateToken(
    { _id: newUser._id },
    process.env.JWT_REFRESH_TOKEN_EXPIRE
  );
  return res.json({
    message: "user signed up successfully",
    accesstoken,
    refreshToken,
  });
};
