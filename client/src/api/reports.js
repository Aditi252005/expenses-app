import api from "./axiosClient";

export const getSummary = () => api.get("/api/reports/summary");

export const getRangeTotal = (start, end, type = "expense") =>
  api.get("/api/reports/range", { params: { start, end, type } });

export const getMonthly = (year) => api.get("/api/reports/monthly", { params: { year } });

export const getYearly = () => api.get("/api/reports/yearly");

export const getCategoryBreakdown = (start, end, type = "expense") =>
  api.get("/api/reports/categories", { params: { start, end, type } });
