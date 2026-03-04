import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import styles from "./Signup.module.css";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   //e.preventDefault();
  //   //await API.post("api/auth/signup", form);
  //   try {
  //     await API.post("/api/auth/signup", form);
  //   } catch (err) {
  //     alert(err.response.data.msg);
  //   }
  //   navigate("/login");
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/auth/signup", form);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
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
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button className={styles.button} type="submit">
            Sign Up
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