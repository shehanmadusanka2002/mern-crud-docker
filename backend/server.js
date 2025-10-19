require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const userRoutes = require("./routes/user.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// ========================
// Middleware Configuration
// ========================
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (Development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ========================
// Database Connection
// ========================
connectDB();

// ========================
// API Routes
// ========================
// Health check route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MERN CRUD API is running",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      userStats: "/api/users/stats",
    },
  });
});

// API version 1 routes
app.use("/api/users", userRoutes);

// Backward compatibility - keep old routes working
app.use("/users", userRoutes);

// ========================
// Error Handling
// ========================
app.use(notFound);
app.use(errorHandler);

// ========================
// Server Configuration
// ========================
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log("=================================");
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode`);
  console.log(`📡 Listening on http://${HOST}:${PORT}`);
  console.log(`📝 API Documentation: http://${HOST}:${PORT}/`);
  console.log("=================================");
});
