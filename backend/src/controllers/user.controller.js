import createHttpError from 'http-errors';
import { User } from '../models/user.model.js';

// Get all users (Admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const { role, limit = 50, page = 1 } = req.query;
    const filter = role ? { role } : {};
    
    const skip = (page - 1) * limit;
    
    const users = await User.find(filter)
      .select('-password -refreshToken -resetPasswordToken')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const totalUsers = await User.countDocuments(filter);
    
    res.json({
      success: true,
      count: users.length,
      totalUsers,
      page: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get single user (admin)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken -resetPasswordToken');
    if (!user) return next(createHttpError(404, 'User not found'));
    res.json({ success: true, user });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get user profile (own profile)
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken -resetPasswordToken');
    if (!user) return next(createHttpError(404, 'User not found'));
    
    res.json({ success: true, user });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -resetPasswordToken');
    
    if (!user) return next(createHttpError(404, 'User not found'));
    
    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Update user (admin) - change role/name
export const updateUser = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.role) updates.role = req.body.role;
    if (req.body.phone) updates.phone = req.body.phone;
    
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password -refreshToken -resetPasswordToken');
    if (!user) return next(createHttpError(404, 'User not found'));
    res.json({ success: true, message: 'User updated', user });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Delete user (admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(createHttpError(404, 'User not found'));
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Add address
export const addAddress = async (req, res, next) => {
  try {
    const { name, address, city, pincode, phone, isDefault } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return next(createHttpError(404, 'User not found'));
    
    // If this is the first address or marked as default, make it default
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push({ name, address, city, pincode, phone, isDefault: isDefault || user.addresses.length === 0 });
    await user.save();
    
    res.status(201).json({ success: true, message: 'Address added', addresses: user.addresses });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Update address
export const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { name, address, city, pincode, phone, isDefault } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return next(createHttpError(404, 'User not found'));
    
    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) return next(createHttpError(404, 'Address not found'));
    
    // If marking as default, unmark others
    if (isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses[addressIndex] = { 
      ...user.addresses[addressIndex].toObject(), 
      name, 
      address, 
      city, 
      pincode, 
      phone, 
      isDefault 
    };
    
    await user.save();
    
    res.json({ success: true, message: 'Address updated', addresses: user.addresses });
  } catch (err) {
    next(createHttpError(400, err.message));
  }
};

// Delete address
export const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    
    const user = await User.findById(req.user.id);
    if (!user) return next(createHttpError(404, 'User not found'));
    
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();
    
    res.json({ success: true, message: 'Address deleted', addresses: user.addresses });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};

// Get user addresses
export const getUserAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    if (!user) return next(createHttpError(404, 'User not found'));
    
    res.json({ success: true, addresses: user.addresses });
  } catch (err) {
    next(createHttpError(500, err.message));
  }
};
