import sendEmail from "../config/sendEmail.js";
import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generateOTP from "../utils/generateOTP.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";

// register controller
export async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "please provide email,name and password",
                error: true,
                success: false,
            });
        }

        const user = await userModel.findOne({ email });

        if (user) {
            return res.json({
                message: "Email is already registered",
                error: true,
                success: false,
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashPassword,
            avatar: "http://res.cloudinary.com/dbt0ayvqy/image/upload/v1756666939/QuickIt/tvtinhcqpwjvxlqhkndp.jpg",
        };

        const newUser = new userModel(payload);
        const save = await newUser.save();

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`;

        const verifyEmail = await sendEmail({
            sendTo: email,
            subject: "Verify email from QuickIt",
            html: verifyEmailTemplate({
                name,
                url: verifyEmailUrl,
            }),
        });

        return res.json({
            message: "User created successfully",
            error: false,
            success: true,
            data: save,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// verification controller
export async function verifyEmailController(req, res) {
    try {
        const { code } = req.body;
        const user = await userModel.findOne({ _id: code });

        if (!user) {
            return res.status(500).json({
                message: "Invalid code",
                error: true,
                success: false,
            });
        }

        const updateUser = await userModel.updateOne(
            { _id: code },
            { verify_email: true }
        );

        return res.json({
            message: "Verification true",
            error: false,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// login controller
export async function loginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                message: "provide email and password",
                error: true,
                success: false,
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "You don't have an account. Please register first",
                error: true,
                success: false,
            });
        }

        if (user.status !== "Active") {
            return res.status(400).json({
                message: "Contact admin",
                error: true,
                success: false,
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) {
            return res.status(400).json({
                message: "Wrong password",
                error: true,
                success: false,
            });
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        const updateUser = await userModel.findByIdAndUpdate(user._id, {
            last_login_date: new Date().toISOString(),
        });

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };
        res.cookie("accessToken", accessToken, cookiesOptions);
        res.cookie("refreshToken", refreshToken, cookiesOptions);

        return res.json({
            message: "Login successful",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// logout controller
export async function logoutController(req, res) {
    try {
        const userId = req.userId;

        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        const removeRefreshToken = await userModel.findByIdAndUpdate(userId, {
            refresh_token: "",
        });

        return res.json({
            message: "Logout successful",
            error: false,
            success: true,
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// upload user avatar
export async function uploadAvatarController(req, res) {
    try {
        const userId = req.userId; // from auth MW by after verifying token
        const image = req.file; // from multer MW by taking from the user form-data

        const upload = await uploadImageCloudinary(image);

        await userModel.findByIdAndUpdate(userId, { avatar: upload.url });

        return res.json({
            message: "Avatar uploaded succesfully",
            success: true,
            error: false,
            data: {
                _id: userId,
                avatar: upload.url,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// update user details
export async function updateUserDetailsController(req, res) {
    try {
        const userId = req.userId;
        const { name, email, mobile, password } = req.body;

        let hashPassword = "";
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);
        }
        const user = await userModel.findByIdAndUpdate(userId, {
            ...(name && { name: name }),
            ...(email && { email: email }),
            ...(mobile && { mobile: mobile }),
            ...(password && { password: hashPassword }),
        });

        return res.json({
            message: "User details updated successful",
            error: false,
            success: true,
            data: user,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// forgot password not login
export async function forgotPasswordController(req, res) {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        const otp = generateOTP();
        const expiryTime = Date.now() + 60 * 60 * 1000; // 1hr

        const update = await userModel.findByIdAndUpdate(
            user._id,
            {
                forgot_password_otp: otp,
                forgot_password_expiry: new Date(expiryTime).toISOString(),
            },
            { new: true }
        );

        await sendEmail({
            sendTo: email,
            subject: "Forgot password - QuickIt",
            html: forgotPasswordTemplate({ name: user.name, otp: otp }),
        });

        return res.json({
            message: "Check your mail for OTP",
            error: false,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// verify forgot password OTP
export async function verifyForgotPasswordOTPController(req, res) {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                message: "Provide required fields email & otp",
                error: true,
                success: false,
            });
        }
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        const currentTime = new Date().toISOString();
        if (user.forgot_password_expiry < currentTime) {
            return res.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false,
            });
        }

        if (otp !== user.forgot_password_otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false,
            });
        }

        const updateUser = await userModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: "",
            forgot_password_expiry: "",
        });

        return res.json({
            message: "OTP verified successful",
            error: false,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// reset password controller
export async function resetPasswordController(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Provide all the fields",
                error: true,
                success: false,
            });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "confirmPassword must be same with newPassword",
                error: true,
                success: false,
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);
        const update = await userModel.findByIdAndUpdate(user._id, {
            password: hashPassword,
        });

        return res.json({
            message: "Password changed successful",
            error: false,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

// generating new access token by refresh token
export async function refreshTokenController(req, res) {
    try {
        const refreshToken =
            req.cookies.refreshToken ||
            req?.headers?.authorization?.split(" ")[1];
        if (!refreshToken) {
            return res.status(401).json({
                message: "Invalid token",
                error: true,
                success: false,
            });
        }

        const verifyToken = await jwt.verify(
            refreshToken,
            process.env.SECRET_KEY_REFRESH_TOKEN
        );
        if (!verifyToken) {
            return res.status(401).json({
                message: "token is expired",
                error: true,
                success: false,
            });
        }

        const userId = verifyToken._id;
        const newAccessToken = await generateAccessToken(userId);
        const cookiesOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };
        res.cookie("accessToken", newAccessToken, cookiesOptions);

        return res.json({
            message: "new accessToken generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

export async function userDetailsController(req, res) {
    try {
        const userId = req.userId;
        const user = await userModel
            .findById(userId)
            .select("-password -refresh_token");

        return res.json({
            message: "user details",
            data: user,
            error: false,
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something is wrong",
            error: true,
            success: false,
        });
    }
}
