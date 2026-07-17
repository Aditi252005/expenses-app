import { useEffect } from "react";
import styles from "./ReportsPanel.module.css";
import { useReports } from "../hooks/useReports";

function ReportsPanel({ close }) {
  const { monthly, yearly, categories, loading, error, load } = useReports();

  useEffect(() => {
    load();
  }, [load]);

  const maxMonthly = Math.max(1, ...monthly.map((m) => Math.max(m.income, m.expense)));
  const maxCategory = Math.max(1, ...categories.map((c) => c.total));

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Reports 📈</h3>
        <button className={styles.closeBtn} onClick={close}>
          ✖
        </button>
      </div>

      {loading && <div className={styles.empty}>Loading reports...</div>}
      {error && <div className={styles.empty}>{error}</div>}

      {!loading && !error && (
        <>
          <div className={styles.sectionTitle}>This year, by month</div>
          <div className={styles.monthlyChart}>
            {monthly.map((m) => (
              <div key={m.month} className={styles.monthBarGroup}>
                <div className={styles.barPair}>
                  <div
                    className={`${styles.bar} ${styles.barIncome}`}
                    style={{ height: `${(m.income / maxMonthly) * 100}%` }}
                    title={`Income ₹${m.income}`}
                  />
                  <div
                    className={`${styles.bar} ${styles.barExpense}`}
                    style={{ height: `${(m.expense / maxMonthly) * 100}%` }}
                    title={`Expense ₹${m.expense}`}
                  />
                </div>
                <span className={styles.monthLabel}>{m.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.legend}>
            <span>
              <span className={styles.legendDot} style={{ background: "#2ed573" }} />
              Income
            </span>
            <span>
              <span className={styles.legendDot} style={{ background: "#ff6b81" }} />
              Expense
            </span>
          </div>

          <div className={styles.sectionTitle}>Spending by category (this month)</div>
          {categories.length === 0 ? (
            <div className={styles.empty}>No expenses this month yet 🌸</div>
          ) : (
            categories.map((c) => (
              <div key={c.category} className={styles.categoryRow}>
                <div className={styles.categoryLabelRow}>
                  <span>{c.category}</span>
                  <span>₹{c.total}</span>
                </div>
                <div className={styles.categoryTrack}>
                  <div
                    className={styles.categoryFill}
                    style={{ width: `${(c.total / maxCategory) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}

          <div className={styles.sectionTitle}>Yearly totals</div>
          {yearly.length === 0 ? (
            <div className={styles.empty}>No data yet</div>
          ) : (
            yearly.map((y) => (
              <div key={y.year} className={styles.yearlyRow}>
                <span>{y.year}</span>
                <span>
                  +₹{y.income} / -₹{y.expense}
                </span>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default ReportsPanel;
