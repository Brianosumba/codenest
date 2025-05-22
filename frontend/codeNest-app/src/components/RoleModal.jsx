import { useState } from "react";
import API from "../API/api";
import "../styles/roleModal.css";

const RoleModal = ({ user, setUser, onClose, showToast }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!selectedRole) {
      setError("To continue, please choose a role");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await API.put(
        "/users/me",
        { role: selectedRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data.user);
      showToast("Role saved successfully", "success");
      onClose();
    } catch (err) {
      setError("Could not save role. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Welcome, {user.name}! Choose your role to continue</h3>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">-- Select a role --</option>

          <optgroup label="📘 Studentroller">
            <option value="Frontend Student">📗 Frontend Stud</option>
            <option value="Backend Student">📘 Backend Stud</option>
            <option value="Fullstack Student">📙 Fullstack Stud</option>
            <option value="New to Coding">📕 New Coder</option>
          </optgroup>

          <optgroup label="💼 Yrkesroller">
            <option value="Junior Frontend Developer">
              🟢 Jr Frontend Dev
            </option>
            <option value="Junior Backend Developer">🟠 Jr Backend Dev</option>
            <option value="Junior Fullstack Developer">
              🔵 Jr Fullstack Dev
            </option>
            <option value="Mid-level Developer">⚪ Mid Dev</option>
            <option value="Senior Developer">🟣 Senior Dev</option>
          </optgroup>

          <optgroup label="🧑‍🏫 Pedagogiska roller">
            <option value="Frontend Teacher">👨‍🏫 Frontend Teacher</option>
            <option value="Backend Teacher">👩‍🏫 Backend Teacher</option>
            <option value="Fullstack Teacher">🧑‍🏫 Fullstack Teacher</option>
            <option value="Mentor">🧑‍🏫 Mentor</option>
            <option value="Bootcamp Coach">🎓 Coach</option>
          </optgroup>
        </select>

        {error && <p className="error-msg">{error}</p>}

        <button className="save-btn" onClick={handleSave}>
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default RoleModal;
