import { useCallback, useState } from "react";
import { getMonthly, getYearly, getCategoryBreakdown } from "../api/reports";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function useReports() {
  const [monthly, setMonthly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (year = new Date().getFullYear()) => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      const monthEnd = now.toISOString().split("T")[0];

      const [monthlyRes, yearlyRes, categoryRes] = await Promise.all([
        getMonthly(year),
        getYearly(),
        getCategoryBreakdown(monthStart, monthEnd, "expense"),
      ]);

      setMonthly(
        monthlyRes.data.months.map((m) => ({ ...m, label: MONTH_LABELS[m.month - 1] }))
      );
      setYearly(yearlyRes.data.years);
      setCategories(categoryRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  return { monthly, yearly, categories, loading, error, load };
}
