const cors = require("cors");
require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");
require("./models"); // load all models

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const helmet = require("helmet");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// Security middleware
app.use(helmet());

// CORS setup
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);

    // Allowed origins
    const allowedOrigins = [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
    ];

    // Add production frontend if set
    if (process.env.FRONTEND_URL) {
      allowedOrigins.push(process.env.FRONTEND_URL);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", taskRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend Server Running Successfully ",
    environment: process.env.NODE_ENV || "development",
  });
});

// Error handling middleware (must be LAST)
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully ");

    await sequelize.sync({ alter: true });
    console.log("Tables synced successfully ");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} `);
      console.log(`DB Host: ${process.env.DB_HOST}`);
      console.log(`DB Port: ${process.env.DB_PORT}`);
    });

  } catch (error) {
    console.error("DB connection error ", error.message);
    process.exit(1);
  }
};

startServer();