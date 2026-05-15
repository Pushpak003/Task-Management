import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const getList = (res, key) => res.data?.data || res.data?.[key] || [];

export default function TaskLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/tasks/logs");
        setLogs(getList(res, "logs"));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch task logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">Task Logs</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Review status history for the tasks available to your role.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">No task logs found</div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black dark:text-white">Task</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black dark:text-white">Changed By</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black dark:text-white">Old Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black dark:text-white">New Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-black dark:text-white">Changed At</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 text-black dark:text-white">
                      {log.taskId?.title || "Deleted task"}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {log.changedBy?.name || "Unknown"}
                      {log.changedBy?.role ? (
                        <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {log.changedBy.role.replace("_", " ")}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 capitalize">
                      {(log.oldStatus || "Created").replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300 capitalize">
                      {log.newStatus?.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {new Date(log.changedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
