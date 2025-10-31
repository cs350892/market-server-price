import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { config } from '../config/index.js';

export const verifyToken = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) return next(createHttpError(401, 'No token, authorization denied'));
  const token = header.replace('Bearer ', '').trim();
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, email, role }
    return next();
  } catch (err) {
    return next(createHttpError(401, 'Token is not valid'));
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return next(createHttpError(403, 'Admin role required'));
};

export const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') return next();
  return next(createHttpError(403, 'User role required'));
};

export default { verifyToken, isAdmin, isUser };
