import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import useAuth from "../hooks/useAuth";
import { roleRedirect } from "../utils/roleRedirect";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", formData);

      const data = res.data;

      login(data);

      navigate(roleRedirect(data.user.role));
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed"
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
          Login
        </h1>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded mb-4 bg-white dark:bg-gray-700 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          value={formData.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded hover:opacity-90 transition"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          User accounts are created by an authorized manager, admin, or super admin.
        </p>
      </form>
    </div>
  );
};

export default Login;
