import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpIn: process.env.JWT_EXPIRES_IN,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpIn: process.env.JWT_REFRESH_EXPIRES_IN,
  clientUrl: process.env.CLIENT_URL,
  DashboardUrl: process.env.DASHBOARD_URL,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinarySecret: process.env.CLOUDINARY_API_SECRET,
  // PhonePe Configuration
  phonePeMerchantId: process.env.PHONEPE_MERCHANT_ID,
  phonePeSaltKey: process.env.PHONEPE_SALT_KEY,
  phonePeSaltIndex: process.env.PHONEPE_SALT_INDEX,
  phonePeBaseUrl: process.env.PHONEPE_BASE_URL,
};

export const config = Object.freeze(_config);
