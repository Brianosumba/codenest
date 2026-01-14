import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API/api";
import "../styles/auth.css";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await API.post("/auth/register", formData);

      const loginRes = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token } = loginRes.data;

      const currentUser = await login(token);
      if (
        currentUser &&
        (!currentUser.role || currentUser.role.trim() === "")
      ) {
        navigate("/choose-role");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
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
          {isLoading ? <div className="loader"></div> : "Sign up"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
