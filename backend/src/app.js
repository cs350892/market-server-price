import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import globalErrorHandler from "./middleware/globalErrorHandler.js";
import { config } from "./config/index.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

const allowedOrigins = [config.clientUrl, config.DashboardUrl];

// cors policy
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// security middleware
app.use(helmet());
app.use(hpp());

// configuration
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// routes
app.use("/api/v1/auth",authRouter)

// Global error handler
app.use(globalErrorHandler);

export default app;