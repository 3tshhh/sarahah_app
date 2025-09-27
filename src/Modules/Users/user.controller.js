import { Router } from "express";
import * as user from "./Services/user.services.js";
import { authenticateMiddleware } from "../../Middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware.js";
import { Privileges } from "../../Common/enums/user.enum.js";
import { valitationMiddleware } from "../../Middlewares/validation.middleware.js";
import { signUpSchema } from "../../Validators/Schema/user.schema.js";

const userRouter = Router();

//auth routes
userRouter.post("/signup-gmail", user.signUpGmail);
userRouter.post("/signup",valitationMiddleware(signUpSchema), user.signup);
userRouter.post("/login", user.login);
userRouter.post("/confirm-email", user.confirmEmail);
userRouter.post("/resend-otp", user.resendOTP);
userRouter.post("/logout", authenticateMiddleware, user.logout);
userRouter.post("/refresh-token", user.refreshToken);

//acount routes
userRouter.put("/update", authenticateMiddleware, user.updateUser);
userRouter.delete("/delete", authenticateMiddleware, user.deleteUser);


//admin routes
userRouter.get(
  "/list", 
  authenticateMiddleware, 
  authorizationMiddleware(Privileges.ADMINS), 
  user.listUsers);


//password routes
userRouter.post("/forgot-password", user.forgotPassword);
userRouter.patch("/reset-password/:token", user.resetPassword);
userRouter.patch(
  "/update-password",
  authenticateMiddleware,
  user.updatePassword
);

export default userRouter;
