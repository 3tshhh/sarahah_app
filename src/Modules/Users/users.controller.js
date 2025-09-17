import { Router } from "express";
import * as user from "./Services/users.services.js";

const userRouter = Router();

userRouter.post('/signup', user.signup)
userRouter.post('/confirm-otp', user.confirmOTP)
userRouter.post('/resend-otp', user.confirmOTP)
userRouter.post('/login', user.login)
// userRouter.post('/logout', user.logout)

export default userRouter;