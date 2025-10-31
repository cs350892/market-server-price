import createHttpError from 'http-errors';
import User from '../models/User.js';

// Get all users (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get single user (admin)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return next(createHttpError(404, 'User not found'));
    res.json(user);
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Update user (admin) - change role/name
export const updateUser = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.role) updates.role = req.body.role;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return next(createHttpError(404, 'User not found'));
    res.json(user);
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Delete user (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(createHttpError(404, 'User not found'));
    res.json({ message: 'User deleted' });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
