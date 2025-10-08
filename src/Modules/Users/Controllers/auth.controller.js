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
authRouter.post("/resend-otp", user.resendOTP);
authRouter.post("/logout", authenticateMiddleware, user.logout);
authRouter.post("/refresh-token", user.refreshToken);
authRouter.post("/forgot-password", user.forgotPassword);
authRouter.patch("/reset-password/:token", user.resetPassword);
authRouter.patch(
  "/update-password",
  authenticateMiddleware,
  user.updatePassword
);
authRouter.post("/auth-gmail", user.authServiceGmail);

export { authRouter };
