import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});


client.interceptors.request.use(cfg => {
  const token = localStorage.getItem("nova_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

client.interceptors.response.use(res => res, err => {
  if (err?.response?.status === 401) {
    localStorage.removeItem("nova_token");
    window.location.href = "/login";
  }
  return Promise.reject(err);
});

export default client;
