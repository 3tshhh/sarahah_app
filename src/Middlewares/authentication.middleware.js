import { BlackListedToken } from "../DB/Models/index.js";
import { User } from "../DB/Models/index.js";
import { isTokenBlackListed, verifyToken } from "../Utils/index.js";

export const authenticateMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const [bearrer, token] = authorization.split(" ");

  if (!token || !bearrer || bearrer !== "access_token") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = verifyToken(token);
  const isblackListed = await isTokenBlackListed(decoded.jti)
  if (isblackListed) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(decoded?._id, "-password -otps -__v");
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = user;

  req.userToken = { tokenId: decoded.jti, expirationDate: new Date(decoded.exp * 1000),  userId : user._id }; // exp is in seconds
  next();
};
