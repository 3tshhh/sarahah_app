import { Router } from "express";
import * as user from "../Services/user.service.js";
import {
  authenticateMiddleware,
  authorizationMiddleware,
  hostUpload,
  localUpload,
} from "../../../Middlewares/index.js";
import { Privileges } from "../../../Common/enums/user.enum.js";
import { updateProfileSchema } from "../../../Validators/Schema/user.schema.js";

const userRouter = Router();
//user routes
userRouter.put("/update",valitationMiddleware(updateProfileSchema), authenticateMiddleware, user.updateUser);
userRouter.delete("/delete", authenticateMiddleware, user.deleteUser);
userRouter.post(
  "/profile",
  authenticateMiddleware,
  hostUpload({}).single("profile"),
  user.uploadProfileImage
);
userRouter.delete(
  "/delete-profile-image",
  authenticateMiddleware,
  user.deleteProfileImage
);
//admin routes
userRouter.get(
  "/list",
  authenticateMiddleware,
  authorizationMiddleware(Privileges.ADMINS),
  user.listUsers
);

export { userRouter };
