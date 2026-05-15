const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const authorizeRoles = require("../middleware/roles");

const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
  getAllTaskLogs,
  getTaskLogs,
} = require("../controllers/Task");

// CREATE TASK
router.post(
  "/",
  auth,
  authorizeRoles("super_admin", "admin", "manager"),
  createTask,
);

// GET TASKS
router.get("/", auth, getTasks);

// UPDATE STATUS
router.patch("/:id", auth, updateTaskStatus);

// DELETE TASK
router.delete("/:id", auth, authorizeRoles("super_admin", "admin"), deleteTask);

// GET ALL TASK LOGS
router.get("/logs", auth, getAllTaskLogs);

// GET TASK LOGS
router.get("/:id/logs", auth, getTaskLogs);

module.exports = router;
