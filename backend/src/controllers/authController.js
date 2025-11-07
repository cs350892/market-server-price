import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/user.model.js';
import { config } from '../config/index.js';

// Register user (role defaults to 'user')
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createHttpError(400, errors.array()[0].msg));

    const { name, email, password, phone, role = 'user' } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(createHttpError(409, 'User already exists'));

    const user = new User({ name, email, password, phone, role });
    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully', 
      user: { 
        id: user._id, 
        name: user.name,
        email: user.email, 
        role: user.role 
      } 
    });
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

    // Update last active
    await user.updateLastActive();

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpIn || '24h' });

    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user._id, 
        name: user.name,
        email: user.email, 
        role: user.role,
        avatar: user.avatar 
      } 
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get profile
export const profile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(createHttpError(401, 'Unauthorized'));
    
    const user = await User.findById(userId).select('-password -refreshToken -resetPasswordToken');
    if (!user) return next(createHttpError(404, 'User not found'));
    
    res.json({ success: true, user });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Logout (optional - mainly for client-side token removal)
export const logout = async (req, res, next) => {
  try {
    // In a stateless JWT setup, logout is handled client-side
    // But we can clear refresh tokens if stored
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
