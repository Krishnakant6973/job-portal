import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies?.token;
    console.log(req.cookies)
    console.log(token)
    if (!token) {
        return res.status(401).json({
            message: "User not authenticated",
            success: false
        })
    }
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decode.userId;
        req.role = decode.role;
        return next();
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid token",
            success: false
        })
    }
}