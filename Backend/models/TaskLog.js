const mongoose = require("mongoose");

const taskLogSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "Task",

    required: true,
  },

  changedBy: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    required: true,
  },

  oldStatus: {
    type: String,
  },

  newStatus: {
    type: String,
  },

  changedAt: {
    type: Date,

    default: Date.now,
  },
});

module.exports = mongoose.model("TaskLog", taskLogSchema);
