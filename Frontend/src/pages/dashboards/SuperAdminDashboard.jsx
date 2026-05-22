import { Link } from "react-router-dom"; 

export default function SuperAdminDashboard() {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen transition">
      <div className="flex justify-between items-start">
        <div>
      <h1 className="text-3xl font-bold text-black dark:text-white">Super Admin Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to the super admin dashboard</p>
        </div>
      <Link to="/tasks" className="px-5 py-2 bg-white text-black dark:bg-white dark:text-black hover:bg-gray-100 dark:hover:bg-gray-200 font-medium text-sm rounded-lg transition-all duration-200 shadow-sm border border-gray-200 dark:border-transparent">
        Go to Admin Dashboard
      </Link>
    </div>
  </div>
  );
}
