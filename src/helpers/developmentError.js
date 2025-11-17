const developmentError = (err, res) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    stack: err.stack,
    status: err.status || (statusCode >= 400 && statusCode < 500 ? "client error" : "server error"),
    isOperational: err.isOperational || false,
    data: err.data || null,
  });
};

module.exports = developmentError;
