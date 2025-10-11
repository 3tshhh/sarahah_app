import { Router } from "express";
import * as user from "../Services/auth.service.js";
import { authenticateMiddleware, getDeviceInfo, valitationMiddleware } from "../../../Middlewares/index.js";
import { confirmEmailSchema, loginSchema, resendOTPSchema, signUpSchema, updatePasswordSchema } from "../../../Validators/Schema/user.schema.js";

const authRouter = Router();

//auth routes
authRouter.post("/signup",valitationMiddleware(signUpSchema), user.signup);
authRouter.post("/login",valitationMiddleware(loginSchema), getDeviceInfo, user.login);
authRouter.post("/confirm-email",valitationMiddleware(confirmEmailSchema), user.confirmEmail);
authRouter.post("/resend-otp",valitationMiddleware(resendOTPSchema), user.resendOTP);
authRouter.post("/logout", authenticateMiddleware, user.logout);
authRouter.post("/refresh-token", user.refreshToken);
authRouter.post("/forgot-password-link", user.forgotPasswordLink);
authRouter.post("/forgot-password-otp", user.forgotPasswordOTP);
authRouter.patch("/reset-password/:token",rateLimit({
  windowMs: 30 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  handler: (req, res)=>{
    res.status(429).json({ message: "" });
  },
  statusCode: 429,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req.headers['x-forwarded-for']);
    return `${ip}-${req.path}`;
  },
  store: new MongoStore({
    uri: process.env.MONGO_URL,
    collectionName: "rateLimits",
    expireTimeMs: 30 * 60 * 1000,
  })
}), user.resetPasswordWithLink);
authRouter.patch("/reset-password-otp", user.resetPasswordWithOTP);
authRouter.patch(
  "/update-password",
  valitationMiddleware(updatePasswordSchema),
  authenticateMiddleware,
  user.updatePassword
);
authRouter.post("/auth-gmail", user.authServiceGmail);

export { authRouter };
/**
 * {
  
}
 */