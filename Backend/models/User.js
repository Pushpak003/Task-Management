const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  role: {
    type: String,

    enum: [
      "super_admin",
      "admin",
      "manager",
      "employee"
    ],

    default: "employee",
  },

  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

}, {
  timestamps: true,
});

module.exports =
  mongoose.model("User", userSchema);