import User from "../../../DB/Models/user.model.js"
import { encrypt } from "../../../Utils/encrypt.symmetric.js";
import { hashPassword } from "../../../Utils/hashing.js";

export const signup = async (req, res, next) => { 
    
    const { firstName, lastName,email,password,gender,age,phone } = req.body;

        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            
            return next( new Error("email already exists" ));
        }
        /*
        send email
        */


        const hashedPassword = hashPassword(password);
        console.log(hashedPassword);
        
        const encryptedPhone = encrypt(phone);
        console.log(encryptedPhone);

        
        
        const user = new User({ firstName, lastName,email, password: hashedPassword ,gender,age, phone: encryptedPhone });
        await user.save();
        res.status(201).json({message:'account created successfully' , user});
    
}