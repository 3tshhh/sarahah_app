import nodemailer from 'nodemailer';
import fs from 'node:fs';
import EventEmitter from 'events' 

const otpEmitter = new EventEmitter()

otpEmitter.on('sendEmail', (to, subject, html_path,otp) => {
    //otp 6 numbers generation

    console.log(otp);
    // send email 
    let html = fs.readFileSync(html_path);
    html = html.toString().replace(/{{\s*OTP\s*}}/g, otp);
    html = html.toString().replace(/ٍ{{\s*Support@help.net\s*}}/g, process.env.SUPPORT_EMAIL);
    const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        };

        transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

});
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.GOOGLE_APP_PASSWORD,
    },
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
});

export const sendOTPEmail = async (to, subject, html_path,otp) => {
        otpEmitter.emit('sendEmail', to, subject, html_path, otp);
        
}

