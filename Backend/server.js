require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const errorHandler = require("./middleware/error");

const createSuperAdmin =
  require("./utils/createSuperAdmin");

  const taskRoutes =
require("./routes/tasks");


const app = express();

// DB Connection
connectDB()
  .then(async () => {

    await createSuperAdmin();

  });

// Core Middlewares
app.use(express.json());

app.use(helm)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(helmet());

// Public Routes
app.get("/", (req, res) => {
  res.send("Task API Running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Healthy",
  });
});

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/tasks", taskRoutes);
// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
