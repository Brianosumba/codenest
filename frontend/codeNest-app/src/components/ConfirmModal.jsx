import React from "react";
import "../styles/modal.css";
import { AiOutlineWarning } from "react-icons/ai";

const ConfrimModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-icon">
          <AiOutlineWarning size={40} color="#dc3545" />
        </div>
        <h3>{message}</h3>
        <div className="modal-buttons">
          <button className="btn-confirm" onClick={onConfirm}>
            Delete
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfrimModal;
