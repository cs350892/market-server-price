import { config } from "../config/index.js";

function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    errorStack: config.nodeEnv === "developmet" ? err.stack : "",
  });
}

export default globalErrorHandler;
