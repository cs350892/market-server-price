import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { config } from '../config/index.js';

// Register user (role can be provided in body)
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createHttpError(400, errors.array()[0].msg));

    const { name, email, password, role = 'user' } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(createHttpError(409, 'User already exists'));

    const user = new User({ name, email, password, role });
    await user.save();

    res.status(201).json({ success: true, message: 'User registered', user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createHttpError(400, errors.array()[0].msg));

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(createHttpError(404, 'User not found'));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(createHttpError(401, 'Invalid credentials'));

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpIn || '1d' });

    res.json({ success: true, token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Profile
export const profile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createHttpError(401, 'Unauthorized'));
    const user = await User.findById(userId).select('-password');
    if (!user) return next(createHttpError(404, 'User not found'));
    res.json({ success: true, user });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
