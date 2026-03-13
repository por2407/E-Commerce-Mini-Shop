import api from "./axios.js";

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getAllUsers: () => api.get("/auth"),
};
