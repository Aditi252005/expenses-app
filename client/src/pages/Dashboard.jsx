import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { getRangeTotal } from "../api/reports";
import AddExpense from "../components/AddExpense";
import ExpenseItem from "../components/ExpenseItem";
import Calculator from "../components/Calculator";
import ReportsPanel from "../components/ReportsPanel";
import styles from "./Dashboard.module.css";

import Snowfall from "react-snowfall";

function Dashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const { transactions, summary, create, remove } = useTransactions();

  const [showModal, setShowModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalSpent, setTotalSpent] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleSummary = async () => {
    try {
      const res = await getRangeTotal(startDate, endDate, "expense");
      setTotalSpent(res.data.totalSpent);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Snowfall
          snowflakeCount={80}
          color="#f7c6e9"
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
          }}
        />

        <h1 className={styles.welcome}>Hi {user?.name} 💖</h1>

        {/* Top Row */}
        <div className={styles.topRow}>
          <div className={styles.topCard}>💰 ₹ {summary.balance}</div>

          {/* Right Side - Buttons */}
          <div className={styles.rightButtons}>
            <button className={styles.topButton} onClick={() => setShowModal(true)}>
              ➕ Add
            </button>

            <button
              className={styles.topButton}
              onClick={() => setShowSummary(!showSummary)}
            >
              📊 Summary
            </button>

            <button
              className={styles.topButton}
              onClick={() => setShowReports(!showReports)}
            >
              📈 Reports
            </button>
          </div>
        </div>

        {showSummary && (
          <div className={styles.summaryPanel}>
            <div className={styles.summaryHeader}>
              <h3>Summary 💸</h3>
              <button
                className={styles.closeBtn}
                onClick={() => {
                  setShowSummary(false);
                  setTotalSpent(null);
                }}
              >
                ✖
              </button>
            </div>

            <div className={styles.summaryInputs}>
              <input
                type="date"
                max={endDate || new Date().toISOString().split("T")[0]}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button className={styles.summaryBtn} onClick={handleSummary}>
                Calculate
              </button>
            </div>

            {totalSpent !== null && <h4>Total Spent: ₹ {totalSpent}</h4>}
          </div>
        )}

        {showReports && <ReportsPanel close={() => setShowReports(false)} />}

        {/* Add Modal */}
        {showModal && (
          <AddExpense close={() => setShowModal(false)} onAdd={create} />
        )}

        {/* Transactions */}
        <div className={styles.section}>
          <h2>Transactions ✨</h2>

          {transactions.length === 0 ? (
            <p>No transactions yet 🌸</p>
          ) : (
            transactions.map((item) => (
              <ExpenseItem key={item._id} item={item} onDelete={remove} />
            ))
          )}
        </div>

        <Calculator />

        <footer
          style={{
            marginTop: "30px",
            padding: "10px",
            fontSize: "12px",
            color: "#888",
            textAlign: "center",
          }}
        >
          Made with 💖
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
