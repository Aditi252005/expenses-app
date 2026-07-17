import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup as signupRequest } from "../api/auth";
import styles from "./Signup.module.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await signupRequest(form);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.msg;
      if (message === "Account already exists. Please login.") {
        alert(message);
        navigate("/login");
      } else {
        alert(message || "Signup failed");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Account 🌸</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button className={styles.button} type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Signup;
