import { Router } from "express";
import * as user from "../Services/user.service.js";
import { authenticateMiddleware, authorizationMiddleware, localUpload } from "../../../Middlewares/index.js";
import { Privileges } from "../../../Common/enums/user.enum.js";

const userRouter = Router();
//user routes
userRouter.put("/update", authenticateMiddleware, user.updateUser);
userRouter.delete("/delete", authenticateMiddleware, user.deleteUser);
userRouter.post('/profile', authenticateMiddleware, localUpload({folderPath:'user/profiles'}).single('profile'), user.uploadProfileImage);

//admin routes
userRouter.get(
  "/list", 
  authenticateMiddleware, 
  authorizationMiddleware(Privileges.ADMINS), 
  user.listUsers
);


export { userRouter };
