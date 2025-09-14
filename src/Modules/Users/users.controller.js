import { Router } from "express";
import * as user from "./Services/users.services.js";

const userRouter = Router();

userRouter.post('/signup', user.signup)

export default userRouter;