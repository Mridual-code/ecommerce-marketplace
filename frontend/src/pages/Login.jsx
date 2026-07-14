import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem(
        "autocart_token",
        res.data.token
      );

      const profileRes = await API.get("/auth/profile");
      const user = profileRes.data.user;

      setUser(user);

      toast.success(`Welcome, ${user.name}`);

      if (user.role === "Admin") {
        navigate("/admin");
      } else if (user.role === "Manager") {
        navigate("/manager");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      localStorage.removeItem("autocart_token");

      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Login</h1>

        <p>Welcome back to AutoCart</p>

        <form onSubmit={loginUser}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;