import axios from "axios";

// Create an instance with a base URL and configuration
const api = axios.create({
  baseURL: "https://api.example.com", // Replace with your backend URL
  timeout: 10000, // 10 second timeout threshold
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Global request interceptor (e.g., adding Auth tokens)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
