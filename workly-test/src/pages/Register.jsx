import { useState } from "react";
import axios from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/auth/register", form);
      navigate("/login");
    } catch {
      alert("Could not register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-box glass animate-fade" onSubmit={registerUser}>
        <h2>Create Account</h2>
        <p className="subtitle">Join the community</p>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={updateField}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={updateField}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={updateField}
          required
        />
        <textarea
          name="bio"
          placeholder="Tell us something about you..."
          value={form.bio}
          onChange={updateField}
        />

        <button type="submit" disabled={isSubmitting} className="register-btn">
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        <p className="redirect-text">
          Already a member? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
