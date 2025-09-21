import User from "../DB/Models/user.model";

export const confirmEmail = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }, '-password -__v');
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
