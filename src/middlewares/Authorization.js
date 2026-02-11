const jwt = require("jsonwebtoken");
const {CustomError} = require("../helpers/customError");
require("dotenv").config();
const userSchema = require("../models/user.model");

function extractToken(req) {
    let token = null;
    if (req.headers?.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7, authHeader.length).trim();
        }
    } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    } else if (req.body?.token) {
        token = req.body.token;
    }
    return token;
}

//Auth gard middleware
async function authorization(req, res, next) {
    try {
        const token = extractToken(req);
        if (!token) {
            return next(new CustomError("Unauthorized", 401));
        }
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return next(new CustomError("Token expired. Please refresh your token.", 401));
            }
            if (error.name === "JsonWebTokenError") {
                return next(new CustomError("Invalid token.", 401));
            }
            return next(new CustomError("Token verification failed.", 401));
        }
        const user = await userSchema.findOne({
            _id: decoded.id,
            isDeleted: false,
            status: "ACTIVE"
        }).select("_id name email role status");

        if (!user) {
            return next(new CustomError("User not found or inactive.", 401));
        }
        req.user = {
            _id: user._id,
            id: user._id,  // For backward compatibility
            name: user.name,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return next(new CustomError("Authentication failed.", 401));
    }
}

// Authorization gard middleware
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user is authenticated
        if (!req.user) {
            return next(new CustomError("Authentication required.", 401));
        }
        // Admins can access any resource
        if (req.user.role === "ADMIN") {
            return next();
        }
        // Check if user's role is in allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return next(new CustomError(
                `Access denied. Required role: ${allowedRoles.join(" or ")}. Your role: ${req.user.role}`,
                403
            ));
        }
        next();
    }
}
module.exports = {
    authGard: authorization,
    authorize
}