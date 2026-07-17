import api from "./axiosClient";

export const getTransactions = () => api.get("/api/transactions");
export const addTransaction = (form) => api.post("/api/transactions", form);
export const deleteTransaction = (id) => api.delete(`/api/transactions/${id}`);
