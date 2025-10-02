import User from "../../../DB/Models/user.model.js";
import { createOTP } from "../../../Utils/otp.controller.js";
import { decrypt, encrypt } from "../../../Utils/encrypt.symmetric.js";
import { compareHash, hash } from "../../../Utils/hashing.js";
import { generateToken, verifyToken } from "../../../Utils/jwt.js";
import BlackListedToken from "../../../DB/Models/blacklisted-token.model.js";
import { sendOTPEmail } from "../../../Utils/send.email.js";
import { OTPTemplate } from "../../../Constants/constants.strings.js";
import { OAuth2Client } from "google-auth-library";
import { ProvidersEnum } from "../../../Common/enums/user.enum.js";
import { v4 as uuidv4 } from "uuid";

export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password, gender, age, phone } = req.body;

  const isEmailExist = await User.findOne({ email, provider: ProvidersEnum.LOCAL });
  if (isEmailExist) {
    return next(new Error("email already exists"));
  }

  const hashedPassword = hash(password);

  const encryptedPhone = encrypt(phone);

  const otp = createOTP();
  sendOTPEmail(email, "Confirm your email", otp);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    gender,
    age,
    phone: encryptedPhone,
    "otps.confirm": hash(otp),
    "otps.createdAt": Date.now(),
  });
  await user.save();
  res.status(201).json({ message: "account created successfully", user });
};

export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }, "-password -__v");
  if (!user) {
    return next(new Error("Invalid email or otp"));
  }
  if (user.otps.createdAt < Date.now() - 3 * 60 * 1000)
    return next(new Error("otp expired"));

  if (user.otps.confirm) {
    if (!compareHash(otp, user.otps.confirm)) {
      return next(new Error("Invalid email or otp"));
    }
    user.isConfirmed = true;
    user.otps.createdAt = null;
    user.otps.confirm = null;
  }
  if (user.otps.reset) {
    if (!compareHash(otp, user.otps.reset)) {
      return next(new Error("Invalid email or otp"));
    }
    user.otps.createdAt = null;
    user.otps.reset = null;
  }

  await user.save();
  res.status(200).json({ message: "email confirmed successfully", user });
};

export const resendOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Invalid email"));
  }
  const otp = createOTP();
  sendOTPEmail(email, "resend OTP", OTPTemplate, otp);

  if (!user.isConfirmed) {
    user.otps.confirm = hash(otp);
  } else {
    user.otps.reset = hash(otp);
  }
  user.otps.createdAt = Date.now();

  await user.save();

  res.status(200).json({ message: "otp resent successfully", user });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, provider: ProvidersEnum.LOCAL });
  if (!user) {
    return next(new Error("Invalid email or password"));
  }
  if (!compareHash(password, user.password)) {
    return next(new Error("Invalid email or password"));
  }
  if (!user.isConfirmed) {
    return next(new Error("Please confirm your email"));
  }
  const accesstoken = generateToken(
    { _id: user._id },
    process.env.JWT_ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = generateToken(
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
  const decoded = verifyToken(refreshtoken);

  const accesstoken = generateToken(
    { _id: decoded._id },
    process.env.JWT_ACCESS_TOKEN_EXPIRE
  );
  res.status(200).json({
    message: "token refreshed successfully",
    accesstoken,
  });
};

export const listUsers = async (req, res) => {
  const users = await User.find(
    {},
    "-password -otp -__v -email -isConfirmed -otps -createdAt -updatedAt"
  ).populate("Messages");

  res.status(200).json({ message: "users fetched successfully", users });
};

export const updateUser = async (req, res, next) => {
  const { firstName, lastName, email, gender, age, phone } = req.body;

  if (email && email !== req.user.email) {
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return next(new Error("email already exists"));
    }
    var otp = createOTP();
    sendOTPEmail(email, "Confirm your email", otp);
    const blacklistedToken = await BlackListedToken.create({
      tokenId: req.user.tokenId,
      expirationDate: new Date(req.user.exp * 1000),
      userId: req.user._id,
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      firstName,
      lastName,
      email,
      gender,
      age,
      phone: phone ? encrypt(phone) : undefined,
      isConfirmed: email ? false : undefined,
      "otps.confirm": email ? hash(otp) : undefined,
      "otps.createdAt": email ? new Date() : undefined,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ message: "user updated successfully", user });
};

export const deleteUser = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findByIdAndDelete(_id);
  res.status(200).json({ message: "user deleted successfully" });
};

export const logout = async (req, res) => {
  const {
    token: { tokenId, exp },
    user: { _id },
  } = req.user;
  const expirationDate = new Date(exp * 1000);
  const blacklistedToken = await BlackListedToken.create({
    tokenId,
    expirationDate,
    userId: _id,
  });
  res.status(200).json({ message: "logout successfully", blacklistedToken });
};

export const updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!compareHash(oldPassword, user.password)) {
    return next(new Error("Invalid old password"));
  }
  if (compareHash(newPassword, user.password)) {
    return next(new Error("New password must be different from old password"));
  }
  user.password = hash(newPassword);
  await user.save();
  res.status(200).json({
    message: "password updated successfully",
    user,
  });
};

/**
 *
 * @description sends an email with a link that has an encrypted token has the user id and otp for 15 minutes to reset the password
 *
 */
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Invalid email"));
  }
  const otp = createOTP();
  user.otps.reset = hash(otp);
  const resetToken = encrypt(generateToken({ _id: user._id, otp }, "15m"));
  sendOTPEmail(email, "Reset your password", `reset-password ${resetToken}`); // testing link
  await user.save();
  res.status(200).json({ message: "otp sent to your email", user });
};

export const resetPassword = async (req, res, next) => {
  const { newPassword } = req.body;
  const { token } = req.params;
  const { _id, otp } = verifyToken(decrypt(token));
  const user = await User.findById(_id);
  if (!user) {
    return next(new Error("Invalid token"));
  }

  if (!compareHash(otp, user.otps.reset)) {
    return next(new Error("Invalid token"));
  }

  if (compareHash(newPassword, user.password)) {
    return next(new Error("New password must be different from old password"));
  }
  user.password = hash(newPassword);
  user.otps.reset = null;
  await user.save();
  res.status(200).json({ message: "password reset successfully", user });
};

export const authServiceGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const { email, given_name, family_name, email_verified, sub } = ticket.getPayload();
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
      password: hash(uuidv4()),
      googleSub: sub,
    });
  } else {
    newUser = isUserExist;
    isUserExist.email = email;
    isUserExist.firstName = given_name;
    isUserExist.lastName = family_name || " ";
    await isUserExist.save();
  }

  const accesstoken = generateToken(
    { _id: newUser._id },
    process.env.JWT_ACCESS_TOKEN_EXPIRE
  );
  const refreshToken = generateToken(
    { _id: newUser._id },
    process.env.JWT_REFRESH_TOKEN_EXPIRE
  );
  return res.json({
    message: "user signed up successfully",
    accesstoken,
    refreshToken,
  });
};
