import api from "./axiosClient";

export const signup = (form) => api.post("/api/auth/signup", form);
export const login = (credentials) => api.post("/api/auth/login", credentials);
