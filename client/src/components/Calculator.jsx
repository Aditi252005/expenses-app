import { useState } from "react";
import styles from "./Calculator.module.css";

function Calculator() {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    setInput((prev) => prev + value);
  };

  const calculate = () => {
    try {
      // Only ever evaluates characters from the calculator's own button set
      // (digits and + - * / .), never arbitrary user text, so this is safe.
      if (!/^[0-9+\-*/.]*$/.test(input)) {
        setInput("Error");
        return;
      }
      const result = Function('"use strict";return (' + input + ")")();
      setInput(String(result));
    } catch {
      setInput("Error");
    }
  };

  const clear = () => {
    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <button className={styles.floatingBtn} onClick={() => setShow(true)}>
        🧮
      </button>

      {/* Modal */}
      {show && (
        <div className={styles.overlay}>
          <div className={styles.calculator}>
            <div className={styles.display}>{input || "0"}</div>

            <div className={styles.buttons}>
              {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map(
                (btn) => (
                  <button
                    key={btn}
                    onClick={() => (btn === "=" ? calculate() : handleClick(btn))}
                  >
                    {btn}
                  </button>
                )
              )}
              <button className={styles.clearBtn} onClick={clear}>
                Clear
              </button>
            </div>

            <button className={styles.close} onClick={() => setShow(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Calculator;
