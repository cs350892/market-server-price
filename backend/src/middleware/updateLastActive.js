import createHttpError from "http-errors";
import { User } from "../models/user.model.js";

const updateUserLastActive = async (req, res, next) => {
  try {
    // Only run for authenticated users
    if (!req.user || !req.user._id) {
      return next(); // Skip if no authenticated user
    }
    
    // update user last active
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(createHttpError(404, "No user found"));
    }
    await user.updateLastActive();
    next();
  } catch (error) {
    console.error("Error updating last active:", error);
    next(); // continue request flow even if this fails
  }
};

export default updateUserLastActive;
