import { useState } from "react";
import API from "../utils/api";
import styles from "./AddExpense.module.css";

function AddExpense({ close, refresh, setBalance }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    date: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post("/api/expense", form);
    setBalance(res.data.currentBalance);
    refresh();
    close();
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
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Amount</label>
            <input
              type="number"
              onChange={(e) =>
                setForm({ ...form, amount: Number(e.target.value) })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Type</label>
            <select
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Date</label>
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          <div className={styles.buttonRow}>
            <button
              type="submit"
              className={styles.primaryBtn}
            >
              Add 💸
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