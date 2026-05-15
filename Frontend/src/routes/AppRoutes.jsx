import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Users from "../pages/Users";
import Tasks from "../pages/Tasks";
import TaskLogs from "../pages/TaskLogs";

import SuperAdminDashboard from "../pages/dashboards/SuperAdminDashboard";
import AdminDashboard from "../pages/dashboards/AdminDashboard";
import ManagerDashboard from "../pages/dashboards/ManagerDashboard";
import EmployeeDashboard from "../pages/dashboards/EmployeeDashboard";

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/register"
        element={
          <ProtectedRoute
            allowedRoles={[
              "super_admin",
              "admin",
            ]}
          >
            <Register />
          </ProtectedRoute>
        }
      />

      {/* Users Management */}
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      {/* Tasks Management */}
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />

      {/* Task Logs */}
      <Route
        path="/task-logs"
        element={
          <ProtectedRoute>
            <TaskLogs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/super-admin"
        element={
          <ProtectedRoute
            allowedRoles={["super_admin"]}
          >
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/manager"
        element={
          <ProtectedRoute
            allowedRoles={["manager"]}
          >
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/employee"
        element={
          <ProtectedRoute
            allowedRoles={["employee"]}
          >
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
