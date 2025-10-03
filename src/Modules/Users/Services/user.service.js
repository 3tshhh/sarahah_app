import { User, BlackListedToken, Message } from "../../../DB/Models/index.js";
import fs from "fs";
import {
  createOTP,
  encrypt,
  hash,
  sendOTPEmail,
} from "../../../Utils/index.js";

export const listUsers = async (req, res) => {
  const users = await User.find(
    {},
    "-password -otp -__v -email -isConfirmed -otps -createdAt -updatedAt"
  ).populate("Messages");


  res.status(200).json({ message: "users fetched successfully", users });
};

export const updateUser = async (req, res, next) => {
  const { firstName, lastName, email, gender, age, phone } = req.body;
  const user = req.user;
  if (email && email !== req.user.email) {
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return next(new Error("email already exists"));
    }
    var otp = createOTP();
    sendOTPEmail(email, "Confirm your email", otp);
    const blacklistedToken = await BlackListedToken.create({
      tokenId: req.userToken.tokenId,
      expirationDate: new Date(req.user.exp * 1000),
      userId: req.user._id,
    });
  }
  if (phone) user.phone = encrypt(phone);
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) {
    user.email = email;
    user.isConfirmed = false;
    user.otps.confirm = hash(otp);
    user.otps.createdAt = new Date();
  }
  if (age) user.age = age;
  if (gender && Object.values(GenderEnum).includes(gender))
    user.gender = gender;

  await user.save();

  return res.status(200).json({ message: "user updated successfully", user });
};

export const deleteUser = async (req, res, next) => {
  const user = req.user;
  const deletedUser = await user.deleteOne();
  try {
    fs.unlinkSync(deletedUser.profilePicture);
  } catch (err) {
    return next;
  }
  const blacklistedToken = await BlackListedToken.create({
    tokenId: req.userToken.tokenId,
    expirationDate: new Date(req.user.exp * 1000),
    userId: req.user._id,
  });

  await Message.deleteMany({ receiverId: _id });
  return res
    .status(200)
    .json({ message: "user deleted successfully", user: deletedUser });
};

export const uploadProfileImage = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("profile image is required"));
  }
  const { _id } = req.user;
  const { path } = req.file;

  const user = await User.findByIdAndUpdate(
    _id,
    { profilePicture: path },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "profile image uploaded successfully", user });
};
