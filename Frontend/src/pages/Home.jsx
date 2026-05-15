import Navbar from "../components/Navbar";
import hero from "../assets/hero.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col-reverse lg:flex-row items-center gap-12">

        {/* Left */}
        <div className="flex-1">
          <h1 className="text-5xl font-bold leading-tight text-black dark:text-white">
            Hierarchy-based <br />
            Task Management System
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg leading-relaxed">
            Manage teams, assign tasks, track progress,
            and control access with secure role-based
            dashboards built using the MERN stack.
          </p>

          <div className="flex gap-4 mt-8">
            <Link
              to="/login"
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="border border-black dark:border-white text-black dark:text-white px-6 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex-1">
          <img
            src={hero}
            alt="hero"
            className="w-full max-w-xl mx-auto dark:opacity-90"
          />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-16"
      >
        <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">
          Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="border border-gray-300 dark:border-gray-900 rounded-2xl p-6 shadow-sm dark:bg-gray-800 hover:shadow-md dark:hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
              Role-Based Access
            </h3>

            <p className="text-gray-600 dark:text-gray-400">
              Secure authentication and dashboard access
              based on user roles.
            </p>
          </div>

          <div className="border border-gray-300 dark:border-gray-900 rounded-2xl p-6 shadow-sm dark:bg-gray-800 hover:shadow-md dark:hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
              Task Management
            </h3>

            <p className="text-gray-600 dark:text-gray-400">
              Create, assign, update, and track tasks
              efficiently.
            </p>
          </div>

          <div className="border border-gray-300 dark:border-gray-900 rounded-2xl p-6 shadow-sm dark:bg-gray-800 hover:shadow-md dark:hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
              Team Hierarchy
            </h3>

            <p className="text-gray-600 dark:text-gray-400">
              Manage reporting structure using hierarchy
              based user control.
            </p>
          </div>

          <div className="border border-gray-300 dark:border-gray-900 rounded-2xl p-6 shadow-sm dark:bg-gray-800 hover:shadow-md dark:hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
              JWT Security
            </h3>

            <p className="text-gray-600 dark:text-gray-400">
              Access token and refresh token strategy
              for secure sessions.
            </p>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section
        id="roles"
        className="bg-gray-50 dark:bg-gray-900 py-16 transition"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-black dark:text-white">
            Supported Roles
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-300 dark:border-gray-600">
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                Super Admin
              </h3>

              <p className="text-gray-600 dark:text-gray-300">
                Full access to system users, tasks,
                hierarchy, and analytics.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-300 dark:border-gray-600">
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                Admin
              </h3>

              <p className="text-gray-600 dark:text-gray-300">
                Manage managers, employees, and task
                assignments.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-300 dark:border-gray-600">
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                Manager
              </h3>

              <p className="text-gray-600 dark:text-gray-300">
                Track team progress and assign tasks to
                direct members.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-300 dark:border-gray-600">
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                Employee
              </h3>

              <p className="text-gray-600 dark:text-gray-300">
                View assigned tasks and update task
                statuses.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="max-w-5xl mx-auto px-6 py-16 text-center"
      >
        <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">
          About Project
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          This project is a MERN stack based hierarchy-wise
          login and task management system with role-based
          access control, JWT authentication, secure APIs,
          and responsive dashboards.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-300 dark:border-gray-700 py-6 text-center text-gray-500 dark:text-gray-400">
        © 2026 TaskFlow. MERN Assignment Project.
      </footer>
    </div>
  );
};

export default Home;
