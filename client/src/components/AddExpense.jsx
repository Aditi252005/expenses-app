import { useState } from "react";
import styles from "./AddExpense.module.css";
import { categoriesForType } from "../utils/categories";

function AddExpense({ close, onAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: categoriesForType("expense")[0],
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleTypeChange = (type) => {
    setForm({ ...form, type, category: categoriesForType(type)[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.date) {
      alert("Please fill all fields");
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({ ...form, amount: Number(form.amount) });
      close();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to add transaction ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Add Transaction 💖</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Amount</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              {categoriesForType(form.type).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Date</label>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          <div className={styles.buttonRow}>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={submitting}
            >
              {submitting ? "Adding..." : "Add 💸"}
            </button>

            <button
              type="button"
              className={styles.cancelBtn}
              onClick={close}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
