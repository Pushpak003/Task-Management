const { body } = require("express-validator");


// ==============================
// Register Validation
// ==============================

exports.registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage(
      "Password must be at least 6 characters"
    ),

  body("role")
    .isIn([
      "super_admin",
      "admin",
      "manager",
      "employee",
    ])
    .withMessage("Invalid role"),
];


// ==============================
// Login Validation
// ==============================

exports.loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Valid email required"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];