import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { config } from '../config/index.js';

// Named export `authenticate` to match how routes import it.
export const authenticate = (req, res, next) => {
  const header = req.header('Authorization');
  if (!header) return res.status(401).json({ message: 'No token, authorization denied' });
  const token = header.replace('Bearer ', '').trim();

  try {
    const decoded = jwt.verify(token, config.jwtSecret || process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Access denied. Admin rights required.' });
};

// Default export for backward compatibility
export default { authenticate, checkAdmin };
