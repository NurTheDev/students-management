const jwt = require("jsonwebtoken");
const {CustomError} = require("../helpers/customError");
require("dotenv").config();
function extractToken(req){
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
async function authGard(req, res, next) {
    try {
        const token = extractToken(req);
        if (!token) {
            return next(new CustomError("Unauthorized", 401));
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        console.log(req.user)
        next();
    } catch (error) {
        console.error(error);
        if (error.name === "TokenExpiredError") {
            return next(new CustomError("Token expired", 401));
        }
        next(new CustomError("Unauthorized", 401));
    }
}
module.exports = authGard;