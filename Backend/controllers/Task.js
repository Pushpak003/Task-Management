const Task = require("../models/Task");

const TaskLog = require("../models/TaskLog");

const User = require("../models/User");

const TASK_STATUSES = ["todo", "in_progress", "done", "closed"];

const canManageTask = (currentUser, task) => {
  if (currentUser.role === "super_admin") {
    return true;
  }

  if (currentUser.role === "admin" || currentUser.role === "manager") {
    return task.assignedBy.toString() === currentUser.id;
  }

  return task.assignedTo.toString() === currentUser.id;
};

const canAssignToUser = (currentUser, targetUser) => {
  if (currentUser.role === "super_admin") {
    return true;
  }

  return targetUser.reportsTo?.toString() === currentUser.id;
};

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const currentUser = req.user;

    const { title, description, assignedTo, priority, dueDate } = req.body;

    // FIND TARGET USER

    const targetUser = await User.findById(assignedTo);

    if (!targetUser) {
      return res.status(404).json({
        success: false,

        message: "Assigned user not found",
      });
    }

    // HIERARCHY CHECK

    // SUPER ADMIN
    if (currentUser.role !== "super_admin") {
      // ONLY OWN CHILDREN

      if (targetUser.reportsTo?.toString() !== currentUser.id) {
        return res.status(403).json({
          success: false,

          message: "Cannot assign task outside hierarchy",
        });
      }
    }

    // CREATE TASK

    const task = await Task.create({
      title,

      description,

      assignedBy: currentUser.id,

      assignedTo,

      priority,

      dueDate,
    });

    await TaskLog.create({
      taskId: task._id,
      changedBy: currentUser.id,
      oldStatus: "",
      newStatus: task.status,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(201).json({
      success: true,

      message: "Task created successfully",

      task: populatedTask,
      data: populatedTask,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Task creation failed",
    });
  }
};

// GET TASKS
exports.getTasks = async (req, res) => {
  try {
    const currentUser = req.user;

    const { status, priority, assignedTo } = req.query;

    let filter = {};

    // SUPER ADMIN
    if (currentUser.role === "super_admin") {
      filter = {};
    }

    // ADMIN / MANAGER
    else if (currentUser.role === "admin" || currentUser.role === "manager") {
      // OWN CREATED TASKS

      filter.assignedBy = currentUser.id;
    }

    // EMPLOYEE
    else {
      filter.assignedTo = currentUser.id;
    }

    // FILTERS

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    const tasks = await Task.find(filter)

      .populate("assignedBy", "name email role")

      .populate("assignedTo", "name email role")

      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,

      tasks,
      data: tasks,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to fetch tasks",
    });
  }
};

// UPDATE TASK
exports.updateTaskStatus = async (req, res) => {
  try {
    const currentUser = req.user;

    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,

        message: "Task not found",
      });
    }

    if (!canManageTask(currentUser, task)) {
      return res.status(403).json({
        success: false,

        message: "Not allowed",
      });
    }

    const oldStatus = task.status;

    if (currentUser.role !== "employee") {
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (priority !== undefined) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate || null;

      if (assignedTo !== undefined && assignedTo !== task.assignedTo.toString()) {
        const targetUser = await User.findById(assignedTo);

        if (!targetUser) {
          return res.status(404).json({
            success: false,
            message: "Assigned user not found",
          });
        }

        if (!canAssignToUser(currentUser, targetUser)) {
          return res.status(403).json({
            success: false,
            message: "Cannot assign task outside hierarchy",
          });
        }

        task.assignedTo = assignedTo;
      }
    }

    if (status !== undefined) {
      if (!TASK_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status",
        });
      }

      task.status = status;
    }

    await task.save();

    if (status !== undefined && oldStatus !== task.status) {
      await TaskLog.create({
        taskId: task._id,
        changedBy: currentUser.id,
        oldStatus,
        newStatus: task.status,
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate("assignedBy", "name email role")
      .populate("assignedTo", "name email role");

    res.status(200).json({
      success: true,

      message: "Task updated",

      task: populatedTask,
      data: populatedTask,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Status update failed",
    });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    await TaskLog.deleteMany({ taskId: req.params.id });

    res.status(200).json({
      success: true,

      message: "Task deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Delete failed",
    });
  }
};

// GET ALL TASK LOGS
exports.getAllTaskLogs = async (req, res) => {
  try {
    const currentUser = req.user;

    let taskFilter = {};

    if (currentUser.role === "admin" || currentUser.role === "manager") {
      taskFilter.assignedBy = currentUser.id;
    } else if (currentUser.role === "employee") {
      taskFilter.assignedTo = currentUser.id;
    }

    const taskIds = await Task.find(taskFilter).distinct("_id");

    const logs = await TaskLog.find({
      taskId: { $in: taskIds },
    })
      .populate("taskId", "title status")
      .populate("changedBy", "name role")
      .sort({
        changedAt: -1,
      });

    res.status(200).json({
      success: true,
      logs,
      data: logs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
    });
  }
};

// GET TASK LOGS
exports.getTaskLogs = async (req, res) => {
  try {
    const logs = await TaskLog.find({
      taskId: req.params.id,
    })

      .populate("changedBy", "name role")

      .sort({
        changedAt: -1,
      });

    res.status(200).json({
      success: true,

      logs,
      data: logs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: "Failed to fetch logs",
    });
  }
};
