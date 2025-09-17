import User from "../../../DB/Models/user.model.js"
import { createOTP } from "../../../Utils/otp.controller.js";
import { encrypt } from "../../../Utils/encrypt.symmetric.js";
import { compareHash, hash } from "../../../Utils/hashing.js";
import { sendOTPEmail } from "../../../Utils/send.email.js";
import * as constants from "../../../Constants/constants.strings.js";
import { generateToken } from "../../../Utils/jwt.js";
import BlackListedToken from "../../../DB/Models/blacklisted-token.model.js";

export const signup = async (req, res, next) => { 
    
    const { firstName, lastName,email,password,gender,age,phone } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        
        return next( new Error("email already exists" ));
    }


    const hashedPassword = hash(password);
    // console.log(hashedPassword);
    
    const encryptedPhone = encrypt(phone);
    // console.log(encryptedPhone);

    const otp = createOTP();
    // sendOTPEmail(email, 'Confirm your email',constants.OTPTemplate , otp);
    
    const user = new User({ 
        firstName,
        lastName,
        email,
        password: hashedPassword,
        gender,
        age,
        phone: encryptedPhone, 
        'otps.confirm':hash(otp), 
        'otps.createdAt': Date.now() 
    });
    await user.save();
    res.status(201).json({message:'account created successfully' , user});
    
}

export const confirmOTP = async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new Error("Invalid email or otp"));
    } 
    if(user.otps.createdAt < Date.now() - 3 * 60 * 1000) return next(new Error("otp expired"));
    
    if(user.otps.confirm){
        if (!compareHash(otp, user.otps.confirm)) {
            return next(new Error("Invalid email or otp"));
        }
        user.isConfirmed = true;
        user.otps.createdAt = null
        user.otps.confirm = null;
    }
    if(user.otps.reset){
        if (!compareHash(otp, user.otps.reset)) {
            return next(new Error("Invalid email or otp"));
        }
        user.otps.createdAt = null
        user.otps.reset = null;
    }
    
    await user.save();
    res.status(200).json({ message: 'email confirmed successfully' , user});
}

export const resendOTP = async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new Error("Invalid email"));
    }
    const otp = createOTP();
    // sendOTPEmail(email, 'resend OTP',constants.OTPTemplate , otp);

    user.otps[`${otpType}`] = hash(otp);
    user.otps.createdAt = Date.now();

    await user.save();

    res.status(200).json({ message: 'otp resent successfully' , user});
}

/**
 * spaghetti code upper code :D
 */

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return next(new Error("Invalid email or password"));
    }               
    if (!compareHash(password, user.password)) {
        return next(new Error("Invalid email or password"));
    }   
    if (!user.isConfirmed) {
        return next(new Error("Please confirm your email"));
    }
    const access_token = generateToken({ _id: user._id }, '1h');
    // const refreshToken = generateToken({ _id: user._id}, '1d');
    res.status(200).json({ 
        message: 'login successfully' , 
        access_token, 
        // refreshToken
    });
}

export const logout = async (req, res, next) => {
    const {jti, exp } = req.token;  
    const expirationDate = new Date(exp * 1000); 
    const blacklistedToken = await BlackListedToken.create({ tokenId: jti, expirationDate });
    res.status(200).json({ message: 'logout successfully' ,blacklistedToken});
}


export const listUsers = async (req, res, next) => {
    const user = req.user
    res.status(200).json({ message: 'users fetched successfully' , user});
}

export const updateUser = async (req, res, next) => {
    const { firstName, lastName, email ,gender, age, phone }  = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
        return next(new Error("User not found"));
    }
    if(email && email !== user.email){
        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            return next( new Error("email already exists" ));
        }
        user.email = email;
        user.isConfirmed = false;
        const otp = createOTP();    
        // sendOTPEmail(email, 'Confirm your email',constants.OTPTemplate , otp);
        user.otps.confirm = hash(otp);
        user.otps.createdAt = Date.now();
    }  
    if(firstName) user.firstName = firstName;
    if(lastName) user.lastName = lastName;
    if(gender) user.gender  = gender;
    if(age) user.age = age;
    if(phone) user.phone = encrypt(phone);
    await user.save();
    res.status(200).json({ message: 'user updated successfully' , user}
    );

}

export const deleteUser = async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
        return next(new Error("User not found"));
    }
    await User.findByIdAndDelete(_id);
    res.status(200).json({ message: 'user deleted successfully' });
}