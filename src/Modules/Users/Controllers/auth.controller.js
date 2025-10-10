import { Router } from "express";
import * as user from "../Services/auth.service.js";
import {
  authenticateMiddleware,
  getDeviceInfo,
  valitationMiddleware,
} from "../../../Middlewares/index.js";
import { signUpSchema } from "../../../Validators/Schema/user.schema.js";

const authRouter = Router();

//auth routes
authRouter.post("/signup", valitationMiddleware(signUpSchema), user.signup);
authRouter.post("/login", getDeviceInfo, user.login);
authRouter.post("/confirm-email", user.confirmAccount);
authRouter.post("/resend-otp", user.resendConfirmOTP);
authRouter.post("/logout", authenticateMiddleware, user.logout);
authRouter.post("/refresh-token", user.refreshToken);
authRouter.post("/forgot-password-link", user.forgotPasswordLink);
authRouter.post("/forgot-password-otp", user.forgotPasswordOTP);
authRouter.patch("/reset-password/:token", user.resetPasswordWithLink);
authRouter.patch("/reset-password-otp", user.resetPasswordWithOTP);
authRouter.patch(
  "/update-password",
  authenticateMiddleware,
  user.updatePassword
);
authRouter.post("/auth-gmail", user.authServiceGmail);

export { authRouter };
