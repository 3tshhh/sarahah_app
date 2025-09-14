import { send } from "node:process";
import User from "../../../DB/Models/user.model.js"
import { encrypt } from "../../../Utils/encrypt.symmetric.js";
import { hashPassword } from "../../../Utils/hashing.js";
import { sendOTPEmail } from "../../../Utils/send.email.js";
import { v4 as uniqueString } from "uuid";

export const signup = async (req, res, next) => { 
    
    const { firstName, lastName,email,password,gender,age,phone } = req.body;

        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            
            return next( new Error("email already exists" ));
        }


        const hashedPassword = hashPassword(password);
        console.log(hashedPassword);
        
        const encryptedPhone = encrypt(phone);
        console.log(encryptedPhone);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        sendOTPEmail(email, 'Confirm your email', process.env.OTP_HTML , otp);
        
        const user = new User({ firstName, lastName,email, password: hashedPassword ,gender,age, phone: encryptedPhone, 'otps.confirm':otp  });
        await user.save();
        res.status(201).json({message:'account created successfully' , user});
    
}