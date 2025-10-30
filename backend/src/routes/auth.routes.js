import express from "express";
import { registerUser, userLogin } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.post("/login", userLogin);
authRouter.post("/register", registerUser);

export default authRouter;

// import { Router } from "express";
// const router = Router();
// import User from "../models/user.model";
// import { sign } from "jsonwebtoken";
// import { genSalt, hash, compare } from "bcryptjs";

// // Register a new user
// router.post("/register", async (req, res) => {
//   try {
//     const { username, email, password, role } = req.body;

//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const salt = await genSalt(10);
//     const hashedPassword = await hash(password, salt);

//     // Create new user
//     user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role: role || "user",
//     });

//     await user.save();

//     // Generate JWT token
//     const token = sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Login user
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Validate password
//     const isValidPassword = await compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token
//     const token = sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
