import express from "express";
import profileController from "../controllers/profile.controller.js";
import { validateBody } from "../middlewares/validate.js";
import uploadFile from "../middlewares/upload.middleware.js";
import { profile } from "../schemas/profile.schema.js";

const uploadAvatar = uploadFile("avatar");

const profileRouter = express.Router();

profileRouter.get("/", profileController.getProfile);
profileRouter.put(
  "/",
  uploadAvatar.single("avatar"),
  profileController.updateProfile
);
profileRouter.post("/change-password", profileController.changePassword);

export default profileRouter;
