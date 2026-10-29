import axios, { type AxiosInstance } from "axios";
let apiInstance: AxiosInstance | null = null;
const API_BASE_URL = `http://localhost:3000`;

const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};

export function apiService(): AxiosInstance {
  if (!apiInstance) {
    apiInstance = createApiInstance();
  }

  return apiInstance;
}
