const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-management";
const NODE_ENV = process.env.NODE_ENV || "development";
const API_VERSION = process.env.API_VERSION || "/api/v1";
module.exports = {
  PORT,
  MONGO_URI,
  NODE_ENV,
  API_VERSION,
};
