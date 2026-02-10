const express = require("express");
const {globalErrorHandler} = require("./helpers/globalError");
const cors = require("cors");
const morgan = require("morgan");
const path = require("node:path");
const cookieParser = require('cookie-parser')
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true}));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cookieParser());


// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({status: "OK", message: "Server is running"});
});
// default API prefix if not provided
const API_VERSION = process.env.API_VERSION || "/api/v1";

// mount top-level router (routes/index.js should export an express router)
app.use(API_VERSION, require("./routes/index"));

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        statusCode: 404,
        message: "Route not found",
        status: "error"
    });
});
global.appRoot = path.resolve(__dirname)
console.log(global.appRoot, "app root path");
// global error handler
app.use(globalErrorHandler);

module.exports = app;
