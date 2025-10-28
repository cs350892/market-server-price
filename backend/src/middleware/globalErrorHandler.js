import { HttpError } from "http-errors";
import { config } from "../config";

function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    errorStack: config.nodeEnv === "developmet" ? err.stack : "",
  });
}

export default globalErrorHandler;
