const productionError = (err, res) => {
  const statusCode = err.statusCode || 500;
  if (err.isOperational) {
    res.status(statusCode).json({
      statusCode,
      message: err.message,
      status: err.status || "error",
    });
  } else {
    console.error("Unexpected error:", err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      status: "error",
    });
  }
};

module.exports = productionError;
