import { Router } from "express";
import * as user from "./Services/users.services.js";
import { authenticateMiddleware } from "../../Middlewares/authentication.js";

const userRouter = Router();

userRouter.post("/signup", user.signup);
userRouter.post("/confirm-email", user.confirmEmail);
userRouter.post("/resend-otp", user.resendOTP);
userRouter.post("/login", user.login);
userRouter.get("/list", authenticateMiddleware, user.listUser);
userRouter.post("/logout", authenticateMiddleware, user.logout);
userRouter.put("/update", authenticateMiddleware, user.updateUser);
userRouter.delete("/delete", authenticateMiddleware, user.deleteUser);
userRouter.post("/refresh-token", user.refreshToken);
userRouter.post("/forgot-password", user.forgotPassword);
userRouter.patch("/reset-password/:token", user.resetPassword);
userRouter.patch(
  "/update-password",
  authenticateMiddleware,
  user.updatePassword
);

export default userRouter;
