import { useState } from "react";
import styles from "./ExpenseItem.module.css";

function ExpenseItem({ item, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(item._id);
    } catch (err) {
      console.log(err);
      alert("Failed to delete transaction ❌");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.card}>
      {/* LEFT SIDE */}
      <div className={styles.left}>
        <span className={styles.title}>{item.title}</span>
        <span className={styles.date}>
          {new Date(item.date).toLocaleDateString()}
        </span>
        {item.category && (
          <span className={styles.category}>{item.category}</span>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        <span
          className={`${styles.amount} ${
            item.type === "expense" ? styles.expense : styles.income
          }`}
        >
          {item.type === "expense" ? "-" : "+"}₹{item.amount}
        </span>

        <button
          className={styles.actionBtn}
          onClick={handleDelete}
          disabled={deleting}
        >
          🗑
        </button>
      </div>
    </div>
  );
}

export default ExpenseItem;
