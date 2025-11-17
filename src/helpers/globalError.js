require("dotenv").config();
const developmentError = require("./developmentError");
const productionError = require("./productionError");

const globalErrorHandler = (err, req, res, next) => {
  // normalize basic props
  err.statusCode = err.statusCode || 500;
  err.status = err.status || (err.statusCode >= 400 && err.statusCode < 500 ? "client error" : "server error");

  if (process.env.NODE_ENV === "development") {
    developmentError(err, res);
  } else {
    productionError(err, res);
  }
};

module.exports = { globalErrorHandler };
