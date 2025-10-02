export const createOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);// i'll remove it later
    return otp;
}

