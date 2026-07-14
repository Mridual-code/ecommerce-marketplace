import { useState } from "react";
import {
  useNavigate,
  Link
} from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      toast.error(
        "Please complete all required fields"
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await API.post(
        "/auth/register",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        }
      );

      toast.success(
        res.data.message ||
          "Registration successful"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Register</h1>

        <p>Create your AutoCart account</p>

        <form onSubmit={registerUser}>
          <input
            type="text"
            name="name"
            placeholder="Enter name"
            value={form.name}
            onChange={handleChange}
            required
          />

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
            {isSubmitting
              ? "Registering..."
              : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;