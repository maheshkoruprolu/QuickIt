import userModel from "../models/user.model.js";

export const admin = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user || user.role !== "Admin") {
            return res.status(403).json({
                message: "Permission denied",
                error: true,
                success: false
            });
        }
        
        next();
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
};
