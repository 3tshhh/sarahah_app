import User from "../../../DB/Models/user.model.js"
import { encrypt } from "../../../Utils/encrypt.symmetric.js";
import { compareHash, hash } from "../../../Utils/hashing.js";
import { sendOTPEmail } from "../../../Utils/send.email.js";

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sendOTPEmail(email, 'Confirm your email', process.env.OTP_HTML , otp);
    
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
    if (!compareHash(otp, user.otps.confirm)|| user.otps.createdAt < Date.now() - 3 * 60 * 1000) {

        return next(new Error("Invalid email or otp"));
    }
    user.isConfirmed = true;
    user.otps.createdAt = null
    user.otps.confirm = null;
    await user.save();
    res.status(200).json({ message: 'email confirmed successfully' , user});
}