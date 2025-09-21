import BlackListedToken from "../DB/Models/blacklisted-token.model.js";
import User from "../DB/Models/user.model.js";
import { verifyToken } from "../Utils/jwt.js";

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

  const isBlacklisted = await BlackListedToken.findOne({
    tokenId: decoded.jti,
  });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(decoded?._id, "-password -otps -__v");
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.user = { ...user, tokenId: decoded.jti, exp: decoded.exp };
  next();
};
