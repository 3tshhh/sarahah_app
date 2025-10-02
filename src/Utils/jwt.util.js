import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
export const generateToken = (payload, expiresin) => {
    return jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { 
            expiresIn: expiresin,
            jwtid: uuidv4(), 
        }
    );
}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}