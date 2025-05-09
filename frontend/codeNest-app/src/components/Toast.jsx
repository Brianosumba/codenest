import React from "react";
import "../styles/toast.css";
import {
  AiFillStar,
  AiOutlineInfoCircle,
  AiFillEdit,
  AiOutlineCheckCircle,
} from "react-icons/ai";

const Toast = ({ message, visible, type = "success" }) => {
  if (!visible) return null;

  const iconMap = {
    success: <AiFillStar color="gold" size={20} />,
    info: <AiOutlineInfoCircle color="#007bff" size={20} />,
    edit: <AiFillEdit color="#28a745" size={20} />,
    create: <AiOutlineCheckCircle color="#28a745" size={20} />,
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{iconMap[type] || iconMap.success}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
