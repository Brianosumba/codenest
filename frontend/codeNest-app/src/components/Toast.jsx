import React from "react";
import "../styles/toast.css";
import { AiFillStar, AiOutlineInfoCircle } from "react-icons/ai";

const Toast = ({ message, visible, type = "success" }) => {
  if (!visible) return null;

  const icon =
    type === "success" ? (
      <AiFillStar color="gold" size={20} />
    ) : (
      <AiOutlineInfoCircle color="#007bff" size={20} />
    );

  return (
    <div
      className={`toast ${type === "success" ? "toast-success" : "toast-info"}`}
    >
      <span className="toast-icon">{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
