const mongoose = require("mongoose");
const { MONGO_URI } = require("./constants.js");

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI not set in environment");
    }
    const connection = await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected:", connection.connection.host);
  } catch (err) {
    console.error("❌ Error connecting to DB:", err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
