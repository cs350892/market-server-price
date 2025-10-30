// import { compare, genSalt, hash } from 'bcryptjs';
// import { sign } from 'jsonwebtoken';

import createHttpError from "http-errors";
import { User } from "../models/user.model.js";
import { genrateAccessToken, genrateRefreshToken } from "../utils/genrateToken.js";

// Login controller
// export async function login(req, res) {
//     try {
//         const { email, password } = req.body;

//         // Check if user exists
//         const user = await findOne({ email });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Check password
//         const isPasswordValid = await compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = sign(
//             { userId: user._id, email: user.email, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: '24h' }
//         );

//         res.json({
//             token,
// user: {
//     id: user._id,
//     email: user.email,
//     role: user.role
// }
//         });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// }
const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(createHttpError(401, "All fields are required"));
  }
  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return next(createHttpError(404, "User email id not found"));
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      const err = createHttpError(400, "Invalid password");
      return next(err);
    }
    const accessToken = genrateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = genrateRefreshToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      refreshToken,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("login error", error);

    const err = createHttpError(
      500,
      "Internal server error while logging in user"
    );
    next(err);
  }
};

// register user
const registerUser = async (req, res, next) => {
  const { email, role, name, password } = req.body;
  try {
    if (!email || !role || !name || !password) {
      return next(createHttpError(401, "All fields are required"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createHttpError(409, "User already exists"));
    }
    const newUser = new User({ email, role, name, password });
    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Register user error:", error);
    next(createHttpError(500, "Internal server error"));
  }
};

// Register initial admin
export async function registerAdmin(req, res) {
  try {
    // Check if admin already exists
    const adminExists = await findOne({ role: "admin" });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const salt = await genSalt(10);
    const hashedPassword = await hash("admin23", salt);

    // Create admin user
    const admin = new User({
      email: "admin@marketserverprice.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    res.status(201).json({ message: "Admin user created successfully" });
  } catch (error) {
    console.error("Register admin error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Get current user
export async function getCurrentUser(req, res) {
  try {
    const user = await findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export { userLogin, registerUser };