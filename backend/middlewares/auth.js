import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
    try {
        const token =
            req.cookies.accessToken ||
            req?.headers?.authorization?.split(" ")[1]; // in mobile version, the cookies are stored in header. so the authorization contains a string as "`Bearer` `token`"

        if (!token) {
            return res.status(401).json({
                message: "token not found",
            });
        }

        const decode = await jwt.verify(
            token,
            process.env.SECRET_KEY_ACCESS_TOKEN
        );
        if (!decode) {
            return res.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false,
            });
        }

        req.userId = decode.id;
        next();
    } catch (err) {
        return res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

export default auth;
