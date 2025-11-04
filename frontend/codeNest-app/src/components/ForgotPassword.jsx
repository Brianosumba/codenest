import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../API/api";
import "../styles/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("📤 Sending forgot-password request with:", email);

    try {
      const res = await API.post("/auth/forgot-password", { email });
      console.log("✅ Forgot-password response:", res);

      setMessage(res.data.message);
      setEmailVerified(true);
    } catch (err) {
      console.error("❌ Forgot-password error:", err.response);
      setError(err.response?.data?.message || "Error verifying email");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await API.post("/auth/reset-password", {
        email,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>

      {!emailVerified ? (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : "Verify Email"}
          </button>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
        </form>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <input
            type="password"
            name="password"
            value={newPassword}
            placeholder="Enter your new password"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? <div className="loader"></div> : "Reset Password"}
          </button>
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
