// controllers call: success(res, data, message, statusCode?)
function success(res, data = {}, message = "Success", statusCode = 200) {
  const response = {
    message,
    data,
    statusCode,
    status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
  };
  return res.status(statusCode).json(response);
}

module.exports = { success };
