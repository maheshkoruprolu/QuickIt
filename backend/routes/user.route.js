import { Router } from "express";
import {
    forgotPasswordController,
    loginController,
    logoutController,
    refreshTokenController,
    registerUserController,
    resetPasswordController,
    updateUserDetailsController,
    uploadAvatarController,
    userDetailsController,
    verifyEmailController,
    verifyForgotPasswordOTPController,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logoutController);
userRouter.put(
    "/upload-avatar",
    auth,
    upload.single("avatar"),
    uploadAvatarController
);
userRouter.put("/update-user", auth, updateUserDetailsController);
userRouter.put("/forgot-password", forgotPasswordController);
userRouter.put(
    "/verify-forgot-password-otp",
    verifyForgotPasswordOTPController
);
userRouter.put("/reset-password", resetPasswordController);
userRouter.post("/refresh-token", refreshTokenController);
userRouter.get("/user-details", auth, userDetailsController);

export default userRouter;
