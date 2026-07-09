import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import BackButton from "../components/BackButton";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("autocart_token", res.data.token);

      const profileRes = await API.get("/auth/profile");
      const user = profileRes.data.user;

      setUser(user);

      if (user.role === "Admin") {
        navigate("/admin");
      } else if (user.role === "Manager") {
        navigate("/manager");
      } else {
        navigate("/customer");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">

        <BackButton />
        <h1>Login</h1>
        <p>Welcome back to AutoCart</p>

        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={loginUser}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;