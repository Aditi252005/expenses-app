import { useCallback, useEffect, useState } from "react";
import { getTransactions, addTransaction, deleteTransaction } from "../api/transactions";
import { getSummary } from "../api/reports";

const EMPTY_SUMMARY = { balance: 0, totalIncome: 0, totalExpense: 0 };

// The balance/income/expense numbers here are NEVER read from localStorage
// or from a value cached at login time - they're always either (a) returned
// fresh by the mutation itself, or (b) explicitly refetched. That's what
// fixes the "balance goes stale until you log out and back in" bug.
export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [txRes, summaryRes] = await Promise.all([getTransactions(), getSummary()]);
      setTransactions(txRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (form) => {
    const res = await addTransaction(form);
    // Use the freshly-computed summary the server returns immediately,
    // then still do a background refresh to keep the list in sync.
    setSummary({
      balance: res.data.balance,
      totalIncome: res.data.totalIncome,
      totalExpense: res.data.totalExpense,
    });
    await refresh();
    return res.data;
  }, [refresh]);

  const remove = useCallback(async (id) => {
    const res = await deleteTransaction(id);
    setSummary({
      balance: res.data.balance,
      totalIncome: res.data.totalIncome,
      totalExpense: res.data.totalExpense,
    });
    await refresh();
    return res.data;
  }, [refresh]);

  return { transactions, summary, loading, error, create, remove, refresh };
}
