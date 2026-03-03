import { useState } from "react";
import API from "../utils/api";
import styles from "./ExpenseItem.module.css";

function ExpenseItem({ item, refresh, setBalance }) {

  const handleDelete = async () => {
    try {
      const res = await API.delete(`/api/expense/${item._id}`);
      setBalance(res.data.balance);
      refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={styles.card}>

        {/* LEFT SIDE */}
        <div className={styles.left}>
          <span className={styles.title}>
            {item.title}
          </span>
          <span className={styles.date}>
            {new Date(item.date).toLocaleDateString()}
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.right}>
          <span
            className={`${styles.amount} ${
              item.type === "expense"
                ? styles.expense
                : styles.income
            }`}
          >
            {item.type === "expense" ? "-" : "+"}
            ₹{item.amount}
          </span>

          

          <button
            className={styles.actionBtn}
            onClick={handleDelete}
          >
            🗑
          </button>
        </div>

      </div>

      
    </>
  );
}

export default ExpenseItem;