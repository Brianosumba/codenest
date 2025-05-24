import { useState, useEffect } from "react";
import API from "../API/api";
import "../styles/profileSettings.css";
import { useAuth } from "../context/AuthContext";

const ProfileSettings = ({ showToast }) => {
  const { user, setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role || "");
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await API.get("/users/roles");
        setRolesData(res.data);
      } catch (err) {
        setError("Failed to load roles.");
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleUpdate = async () => {
    if (!selectedRole) {
      setError("Please select a role");
      return;
    }

    setError("");
    setLoading(true);

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
      showToast("Your role was updated", "success");
    } catch (err) {
      setError("Could not update role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings-container">
      <h2>Profile Settings</h2>
      <p>
        <strong>Name:</strong> {user?.name}
      </p>

      <label htmlFor="role">Current Role:</label>

      {loadingRoles ? (
        <p>Loading roles...</p>
      ) : (
        <select
          id="role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">-- Select Role --</option>
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

      <button onClick={handleUpdate} disabled={loading || loadingRoles}>
        {loading ? "Updating..." : "Update Role"}
      </button>
    </div>
  );
};

export default ProfileSettings;
