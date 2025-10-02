import { User, BlackListedToken } from "../../../DB/Models/index.js";
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

export const uploadProfileImage = async (req, res, next) => {
  if (!req.file) {
    return next(new Error("profile image is required"));
  }
  const {_id } = req.user;
  const {path} = req.file;

  const user = await User.findByIdAndUpdate(_id, {profilePicture: path}, {new:true});
  return res.status(200).json({ message: "profile image uploaded successfully" , user});
};
