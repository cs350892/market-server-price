import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw err;
  }
};

const authenticate = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return next(createHttpError(401, "Auth token is required"));
  }
  const accessToken = authHeader.split(" ")[1];

  if (!accessToken) {
    return next(createHttpError(401, "Access token not provided"));
  }
  try {
    // verify
    const decoded = verifyToken(accessToken, config.jwtSecret);
    if (!decoded.userId || !decoded.email || !decoded.role) {
      return next(createHttpError(401, "Invalid token payload"));
    }
    const { userId, email, role } = decoded;
    req.userId = userId;
    req.email = email;
    req.isAccessTokenExp = false;
    req.role = role;
    return next();
  } catch (err) {
    console.log("Access token error:", err.message);
  if (err.name === "TokenExpiredError") {
      const refreshTokenHeader = req.header("refreshToken");
      if (!refreshTokenHeader) {
        return next(createHttpError(401, "Refresh token not found"));
      }
      const refreshToken = refreshTokenHeader.split(" ")[1];
      if (!refreshToken) {
        return next(createHttpError(401, "Invalid refresh token format"));
      }
      // verify token
      try {
        const decoded = verifyToken(refreshToken, config.jwtRefreshSecret);
        if (!decoded.userId || !decoded.email || !decoded.role) {
          return next(createHttpError(401, "Invalid token payload"));
        }
        const { userId, email, role } = decoded;
        req.userId = userId;
        req.email = email;
        req.isAccessTokenExp = true;
        req.role = role;
        return next();
      } catch (error) {
        console.log("Refresh token error:", error.message);
        return next(
          createHttpError(
            401,
            "Invalid or expired refresh token. Please log in again."
          )
        );
      }
    }
  }
};
