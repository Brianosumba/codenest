import "../styles/toast.css";
import {
  AiFillStar,
  AiOutlineInfoCircle,
  AiFillEdit,
  AiOutlineCheckCircle,
  AiOutlineDelete,
} from "react-icons/ai";
import { GiPartyPopper } from "react-icons/gi";

const Toast = ({ message, visible, type = "success" }) => {
  if (!visible) return null;

  const iconMap = {
    success: <AiFillStar color="gold" size={20} />,
    info: <AiOutlineInfoCircle color="#007bff" size={20} />,
    edit: <AiFillEdit color="#28a745" size={20} />,
    create: <AiOutlineCheckCircle color="#28a745" size={20} />,
    delete: <AiOutlineDelete color="#dc3545" size={20} />,
    saved: <GiPartyPopper className="popper-icon" color="#f50057" size={24} />,
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{iconMap[type] || iconMap.success}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
