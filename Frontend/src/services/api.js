import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : undefined);

if (!baseURL) {
  throw new Error("Missing VITE_API_URL. Set it to your deployed backend URL.");
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh (basic structure)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // later: call refresh token API here
    }
    return Promise.reject(err);
  }
);

export default api;
