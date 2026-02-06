const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app.js");
const { connectDB } = require("./src/config/db.js");
const { PORT } = require("./src/config/constants.js");
const bootstrapAdmin = require('./src/utils/bootstrapAdmin');

const start = async () => {
  await connectDB();

  if (process.env.NODE_ENV === 'development') {
    await bootstrapAdmin();
  }
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}, http://localhost:${PORT}`));
};
start().catch((err) => {
  console.error("❌ Server failed to start:", err);
  process.exit(1);
});
