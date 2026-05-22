import { Link } from "react-router-dom"; 

export default function SuperAdminDashboard() {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen transition">
      <h1 className="text-3xl font-bold text-black dark:text-white">Super Admin Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to the super admin dashboard</p>
      <Link to="/tasks" className="text-blue-500 hover:text-blue-700">
        Go to Admin Dashboard
      </Link>
    </div>
  );
}
