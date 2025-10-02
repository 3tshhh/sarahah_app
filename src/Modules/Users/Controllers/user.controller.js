import { Router } from "express";
import * as user from "../Services/user.service.js";
import { authenticateMiddleware, authorizationMiddleware } from "../../../Middlewares/index.js";
import { Privileges } from "../../../Common/enums/user.enum.js";

const userRouter = Router();
//user routes
userRouter.put("/update", authenticateMiddleware, user.updateUser);
userRouter.delete("/delete", authenticateMiddleware, user.deleteUser);


//admin routes
userRouter.get(
  "/list", 
  authenticateMiddleware, 
  authorizationMiddleware(Privileges.ADMINS), 
  user.listUsers
);


export { userRouter };
