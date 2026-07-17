import axios from "axios";

// Was hardcoded to a specific Render deployment URL before; now configurable
// per environment via VITE_API_URL, falling back to localhost for local dev.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL });

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Centralized 401 handling: if the token is invalid/expired, clear the stale
// session so the app doesn't get stuck showing data for a session the server
// no longer recognizes.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default api;
