import express from "express";
import { registerUser, userLogin } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/login", userLogin);
authRouter.post("/register", registerUser);

export default authRouter;

