import { Router } from "express";
import * as user from "../Services/auth.service.js";
import { authenticateMiddleware, getDeviceInfo, valitationMiddleware } from "../../../Middlewares/index.js";
import { confirmEmailSchema, forgotPasswordSchema, loginSchema, resendOTPSchema, resetPasswordSchema, signUpSchema, updatePasswordSchema } from "../../../Validators/Schema/user.schema.js";

const authRouter = Router();

//auth routes
authRouter.post("/signup",valitationMiddleware(signUpSchema), user.signup);
authRouter.post("/login",valitationMiddleware(loginSchema), getDeviceInfo, user.login);
authRouter.post("/confirm-email",valitationMiddleware(confirmEmailSchema), user.confirmEmail);
authRouter.post("/resend-otp",valitationMiddleware(resendOTPSchema), user.resendOTP);
authRouter.post("/logout", authenticateMiddleware, user.logout);
authRouter.post("/refresh-token", user.refreshToken);
authRouter.post("/forgot-password",valitationMiddleware(resendOTPSchema), user.forgotPassword);
authRouter.patch("/reset-password/:token",valitationMiddleware(resetPasswordSchema), user.resetPassword);
authRouter.patch(
  "/update-password",
  valitationMiddleware(updatePasswordSchema),
  authenticateMiddleware,
  user.updatePassword
);
authRouter.post("/auth-gmail", user.authServiceGmail);




export {authRouter};
