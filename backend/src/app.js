import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import { config } from "./config/index.js";
import authRouter from "./routes/authRoutes.js";
import productsRouter from "./routes/products.routes.js";
import usersRouter from "./routes/users.routes.js";
import adminRouter from "./routes/admin.routes.js";
import ordersRouter from "./routes/orders.routes.js";
import brandsRouter from "./routes/brands.routes.js";
import categoriesRouter from "./routes/categories.routes.js";
import messagesRouter from "./routes/messages.routes.js";
import offersRouter from "./routes/offer.routes.js";

const app = express();

// Simple CORS configuration for development
app.use(cors({
  origin: '*', // Allow all origins in development
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// security middleware
app.use(helmet());
app.use(hpp());

// configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.use("/api/v1/auth", authRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/orders', ordersRouter);
app.use('/api/v1/brands', brandsRouter);
app.use('/api/v1/categories', categoriesRouter);
app.use('/api/v1/messages', messagesRouter);
app.use('/api/v1/offers', offersRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;