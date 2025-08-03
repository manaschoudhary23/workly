import { useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", form);
      console.log("Login success:", res.data);

      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box glass animate-fade" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your community</p>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={updateField}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={updateField}
          required
        />

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="redirect-text">
          Don’t have an account? <a href="/register">Register here</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
