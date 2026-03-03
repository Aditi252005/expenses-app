import styles from "./Bal.module.css";

function Bal({ balance }) {
  return (
    <div className={styles.card}>
      <h3>Current Balance</h3>
      <h1>₹ {balance}</h1>
    </div>
  );
}

export default Bal;