import { Router } from "express";
import * as user from "./Services/users.services.js";
import { authenticateMiddleware } from "../../Middlewares/authentication.js";
import { confirmEmail } from "../../Middlewares/confirm-email.js";

const userRouter = Router();

userRouter.post("/signup", user.signup);
userRouter.post("/confirm-email", confirmEmail);
userRouter.post("/resend-otp", user.resendOTP);
userRouter.post("/login", user.login);
userRouter.get("/list", authenticateMiddleware, user.listUser);
userRouter.post("/logout", authenticateMiddleware, user.logout);
userRouter.patch("/update", authenticateMiddleware, user.updateUser);
userRouter.delete("/delete", authenticateMiddleware, user.deleteUser);
userRouter.post("/refresh-token", user.refreshToken);


export default userRouter;
