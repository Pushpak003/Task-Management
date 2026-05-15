import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const statusOptions = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "closed", label: "Closed" },
];

const priorityOptions = ["low", "medium", "high"];

const emptyForm = {
  title: "",
  description: "",
  assignedTo: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

const getList = (res, key) => res.data?.data || res.data?.[key] || [];

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const canCreateTask = ["super_admin", "admin", "manager"].includes(user?.role);
  const canEditTask = canCreateTask;
  const canDeleteTask = ["super_admin", "admin"].includes(user?.role);

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(getList(res, "tasks"));
  };

  useEffect(() => {
    let ignore = false;

    const loadPage = async () => {
      try {
        setLoading(true);
        setError("");
        const tasksRes = await api.get("/tasks");
        const usersRes = canCreateTask ? await api.get("/users") : null;

        if (!ignore) {
          setTasks(getList(tasksRes, "tasks"));
          if (usersRes) {
            setAssignableUsers(getList(usersRes, "users").filter((item) => item._id !== user?.id));
          }
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || "Failed to load tasks");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      ignore = true;
    };
  }, [canCreateTask, user?.id]);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      ...emptyForm,
      assignedTo: assignableUsers[0]?._id || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      const payload = {
        ...formData,
        dueDate: formData.dueDate || undefined,
      };

      if (editingId) {
        await api.patch(`/tasks/${editingId}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      await fetchTasks();
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      setError("");
      await api.patch(`/tasks/${taskId}`, { status: newStatus });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      assignedTo: task.assignedTo?._id || "",
      status: task.status || "todo",
      priority: task.priority || "medium",
      dueDate: task.dueDate?.split("T")[0] || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      setError("");
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
      case "in_progress":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "done":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "closed":
        return "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">Task Management</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create tasks, assign users, update status, and review task activity.
            </p>
          </div>

          {canCreateTask && (
            <button
              onClick={openCreateModal}
              className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-lg hover:opacity-90 transition"
            >
              + Create Task
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">No tasks found</div>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <article
                key={task._id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md dark:hover:shadow-lg transition"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-black dark:text-white">{task.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{task.description || "No description"}</p>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(task.status)}`}>
                    {task.status?.replace("_", " ")}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                  <Info label="Assigned To" value={task.assignedTo?.name || "Unassigned"} />
                  <Info label="Assigned By" value={task.assignedBy?.name || "Unknown"} />
                  <Info label="Priority" value={task.priority || "medium"} capitalize />
                  <Info
                    label="Due Date"
                    value={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                  />
                  <Info label="Created" value={new Date(task.createdAt).toLocaleDateString()} />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white text-sm"
                  >
                    {statusOptions.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSelectedTask(task)}
                    className="px-3 py-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    View Logs
                  </button>

                  {canEditTask && (
                    <button
                      onClick={() => handleEdit(task)}
                      className="px-3 py-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Edit
                    </button>
                  )}

                  {canDeleteTask && (
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="px-3 py-1 text-red-600 dark:text-red-400 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                {editingId ? "Edit Task" : "Create Task"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Field label="Title">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    required
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    rows="4"
                  />
                </Field>

                <Field label="Assign To">
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    required
                  >
                    <option value="">Select user</option>
                    {assignableUsers.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name} ({item.role?.replace("_", " ")})
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Status">
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Priority">
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white capitalize"
                    >
                      {priorityOptions.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label="Due Date">
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                  />
                </Field>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded hover:opacity-90"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Task Logs: {selectedTask.title}
                </h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  aria-label="Close task logs"
                >
                  X
                </button>
              </div>

              <TaskLogsView taskId={selectedTask._id} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</span>
      {children}
    </label>
  );
}

function Info({ label, value, capitalize = false }) {
  return (
    <div>
      <p className="text-gray-600 dark:text-gray-400">{label}</p>
      <p className={`text-black dark:text-white font-medium ${capitalize ? "capitalize" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function TaskLogsView({ taskId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/tasks/${taskId}/logs`);
        setLogs(getList(res, "logs"));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [taskId]);

  if (loading) return <p className="text-gray-600 dark:text-gray-400">Loading logs...</p>;
  if (error) return <p className="text-red-600 dark:text-red-400">{error}</p>;

  return (
    <div className="space-y-3">
      {logs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No logs found</p>
      ) : (
        logs.map((log) => (
          <div key={log._id} className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {log.changedBy?.name || "Unknown"} - {new Date(log.changedAt).toLocaleString()}
            </p>
            <p className="text-black dark:text-white font-medium">
              Status: {log.oldStatus || "Created"} -&gt; {log.newStatus}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
