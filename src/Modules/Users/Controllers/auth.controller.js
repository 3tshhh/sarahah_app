import { Router } from "express";
import * as user from "../Services/auth.service.js";
import {
  authenticateMiddleware,
  getDeviceInfo,
  valitationMiddleware,
} from "../../../Middlewares/index.js";
import { signUpSchema } from "../../../Validators/Schema/user.schema.js";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../../../DB/Connections/redis.db.connection.js";
import MongoStore from "rate-limit-mongo/lib/mongoStore.js";

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
authRouter.patch("/reset-password/:token",rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many password reset attempts from this IP, please try again after 15 minutes",
  statusCode: 429,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req.headers['x-forwarded-for']);
    return `${ip}-${req.path}`;
  },
  store: new MongoStore({
    
  })
}), user.resetPasswordWithLink);
authRouter.patch("/reset-password-otp", user.resetPasswordWithOTP);
authRouter.patch(
  "/update-password",
  authenticateMiddleware,
  user.updatePassword
);
authRouter.post("/auth-gmail", user.authServiceGmail);

export { authRouter };
/**
 * {
  
}
 */