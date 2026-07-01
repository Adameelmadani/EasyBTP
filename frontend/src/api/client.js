import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

// Joindre le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("viabtp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Déconnexion automatique sur 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config.url.includes("/auth/")) {
      localStorage.removeItem("viabtp_token");
      if (window.location.pathname !== "/login") window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
