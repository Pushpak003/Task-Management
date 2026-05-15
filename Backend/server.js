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

const parseOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  ...parseOrigins(process.env.FRONTEND_URL),
  ...parseOrigins(process.env.FRONTEND_URLS),
];

const allowedOriginPatterns = [
  /^https:\/\/task-mangment(?:-[a-z0-9-]+)?\.vercel\.app$/,
];

const corsOptions = {
  origin(origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      allowedOriginPatterns.some((pattern) => pattern.test(origin))
    ) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

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
