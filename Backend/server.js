require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

const errorHandler = require("./middleware/error");
const createSuperAdmin = require("./utils/createSuperAdmin");

const app = express();

// DB Connection
connectDB().then(async () => {
  await createSuperAdmin();
});

// Core Middlewares
app.use(express.json());

// ✅ Allow ALL origins (CORS fix)
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

app.use(helmet());

// Public Routes
app.get("/", (req, res) => {
  res.send("Task API Running...");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API Healthy" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});