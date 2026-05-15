import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";

const roleOptionsByUserRole = {
  super_admin: ["admin", "manager", "employee"],
  admin: ["manager", "employee"],
  manager: ["employee"],
};

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const allowedRoles = roleOptionsByUserRole[user?.role] || ["employee"];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    role: allowedRoles[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { passwordConfirm, ...payload } = formData;

      await api.post("/auth/register", payload);

      navigate("/users");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md dark:shadow-lg w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
          Create User
        </h1>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <input
          type="text"
          name="name"
          placeholder="Enter name"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="passwordConfirm"
          placeholder="Confirm password"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          value={formData.passwordConfirm}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white"
          value={formData.role}
          onChange={handleChange}
          required
        >
          {allowedRoles.map((role) => (
            <option key={role} value={role}>
              {role.replace("_", " ")}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded hover:opacity-90 transition"
        >
          {loading ? "Loading..." : "Create User"}
        </button>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Back to{" "}
          <Link
            to="/users"
            className="text-blue-500 dark:text-blue-400 hover:underline"
          >
            Users
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
