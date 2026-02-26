const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

function required(name, fallback) {
  const value = process.env[name] || fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smarthub",
  jwtSecret: required("JWT_SECRET", "dev-change-this-secret"),
  encryptionKey: required(
    "ENCRYPTION_KEY",
    "0123456789abcdef0123456789abcdef"
  ),
  corsOrigin: process.env.CORS_ORIGIN || "*",
};

module.exports = { config };
