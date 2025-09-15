import User from "../DB/Models/user.model";
import { verifyToken } from "../Utils/jwt";

export const authenticateMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('access_token ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = verifyToken(token);
    const user = User.findById(decoded._id, '-password -otp -__v');
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
}
    