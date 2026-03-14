import api from "./axios.js";

export const orderApi = {
  getAll: () => api.get("/orders"),
  create: (orderData) => api.post("/orders", orderData),
  getByUser: (userId) => api.get(`/orders/user/${userId}`),
  updateStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
};