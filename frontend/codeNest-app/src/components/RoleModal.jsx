import { useEffect, useState } from "react";
import API from "../API/api";
import { useAuth } from "../context/AuthContext";
import "../styles/roleModal.css";

const RoleModal = ({ onClose, showToast }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [rolesData, setRolesData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { user, setUser, setNeedsRoleSetup } = useAuth();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await API.get("/users/roles");
        setRolesData(res.data);
      } catch (err) {
        setError("Failed to load roles.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, []);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data.user);
      setNeedsRoleSetup(false);
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

        {loading ? (
          <p>Loading roles...</p>
        ) : (
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">-- Select a role --</option>

            {rolesData.map((group, idx) => (
              <optgroup key={idx} label={group.category}>
                {group.roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        )}

        {error && <p className="error-msg">{error}</p>}

        <button className="save-btn" onClick={handleSave}>
          Save & Continue
        </button>
      </div>
    </div>
  );
};

export default RoleModal;
