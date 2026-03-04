import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/api";
import Bal from "../components/Bal";
import AddExpense from "../components/AddExpense";
import ExpenseItem from "../components/ExpenseItem";
import Calculator from "../components/Calculator";
import styles from "./Dashboard.module.css";

import Snowfall from "react-snowfall";




function Dashboard() {
  //const { user } = useContext(AuthContext);
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [balance, setBalance] = useState(user?.balance || 0);
  const [expenses, setExpenses] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalSpent, setTotalSpent] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  // useEffect(() => {
  //   if (!user) navigate("/");
  //   else fetchExpenses();
  // }, [user]);

  

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/");
      else fetchExpenses();
    }
  }, [user, loading]);

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/api/expense");
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSummary = async () => {
    try {
        const res = await API.get(
        `/api/expense/summary?start=${startDate}&end=${endDate}`
        );
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
                zIndex: 9999
            }}
        />
       
      <h1 className={styles.welcome}>
        Hi {user?.name} 💖
      </h1>

      {/* Top Row */}
      <div className={styles.topRow}>
       

        <div className={styles.topCard}>
          💰 ₹ {balance}
        </div>

        {/* Right Side - Buttons */}
        <div className={styles.rightButtons}>
            <button
            className={styles.topButton}
            onClick={() => setShowModal(true)}
            >
            ➕ Add
            </button>

            <button
            className={styles.topButton}
            onClick={() => setShowSummary(!showSummary)}
            >
            📊 Summary
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
            <button
                className={styles.summaryBtn}
                onClick={handleSummary}
            >
                Calculate
            </button>
            </div>

            {totalSpent !== null && (
            <h4>Total Spent: ₹ {totalSpent}</h4>
            )}

        </div>
        )}

      {/* Add Modal */}
      {showModal && (
        <AddExpense
          close={() => setShowModal(false)}
          refresh={fetchExpenses}
          setBalance={setBalance}
        />
      )}

      {/* Transactions */}
      <div className={styles.section}>
        <h2>Transactions ✨</h2>

        {expenses.length === 0 ? (
          <p>No transactions yet 🌸</p>
        ) : (
          expenses.map((item) => (
            <ExpenseItem
              key={item._id}
              item={item}
              refresh={fetchExpenses}
              setBalance={setBalance}
            />
          ))
        )}
      </div>

      

      <Calculator />

    </div>
  </div>
  );
  
}

export default Dashboard;