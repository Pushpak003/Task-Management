const express = require("express");
const router = express.Router();

const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/Auth");

const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");
const authLimiter = require("../middleware/rateLimiter");

const {
  registerValidator,
  loginValidator,
} = require("../utils/validators");


// Login
router.post(
  "/login",
  authLimiter,
  loginValidator,
  login
);


router.post(
  "/register",
  auth,
  authorizeRoles(
    "super_admin",
    "admin",
    "manager"
  ),
  registerValidator,
  register
);

router.post("/refresh", refresh);


// Logout (requires login)
router.post(
  "/logout",
  auth,
  logout
);

module.exports = router;