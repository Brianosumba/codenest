import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../API/api";
import "../styles/auth.css";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("📤 Sending login request with:", formData);

    try {
      const res = await API.post("/auth/login", formData);
      console.log("✅ Login response:", res);

      const { token } = res.data;
      //  Använd login-funktionen från AuthContext
      const currentUser = await login(token);

      const hasRole = currentUser.role && currentUser.role.trim().length > 0;
      if (hasRole) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Login error:", err.response);
      setError(err.response?.data?.message || "Login error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? <div className="loader"></div> : "Sign In"}
        </button>
        {error && <p className="error">{error}</p>}

        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
