import BlackListedToken from "../DB/Models/blacklisted-token.model.js";
import User from "../DB/Models/user.model.js";
import { verifyToken } from "../Utils/jwt.js";

export const authenticateMiddleware = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('access_token ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = verifyToken(token);

    const isBlacklisted = await BlackListedToken.findOne({ tokenId: decoded.jti });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const user = await User.findById(decoded._id, '-password -otps -__v');
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const {jti, exp} = decoded;
    
    req.user = user;
    req.token = {jti, exp};
    next();
}
    