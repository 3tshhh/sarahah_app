import crypto from "crypto";
export const createOTP = () => {
    const otp = crypto.randomBytes(3).toString("hex");
    console.log(otp);
    
    return otp;
}

