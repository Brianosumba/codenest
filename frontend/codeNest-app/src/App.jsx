import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import API from "./API/api";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import CreateSnippet from "./components/CreateSnippet";
import SnippetDetail from "./components/SnippetDetail";
import EditSnippet from "./components/EditSnippet";
import SharedSnippets from "./components/SharedSnippet";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleModal from "./components/RoleModal";
import Toast from "./components/Toast";
import ProfileSettings from "./components/ProfileSettings";

// 🔁 Inre komponent där useNavigate fungerar
const AppContent = ({ user, setUser, toast, showToast }) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
      />

      {/* Visa modal om användaren inte har en roll */}
      {user && !user.role && (
        <RoleModal
          user={user}
          setUser={setUser}
          showToast={showToast}
          onClose={() => navigate("/dashboard")}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-snippet"
          element={
            <ProtectedRoute user={user}>
              <CreateSnippet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/snippet/:id"
          element={
            <ProtectedRoute user={user}>
              <SnippetDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-snippet/:id"
          element={
            <ProtectedRoute user={user}>
              <EditSnippet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shared"
          element={
            <ProtectedRoute user={user}>
              <SharedSnippets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfileSettings
                user={user}
                setUser={setUser}
                showToast={showToast}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

// 🧠 Yttre komponent: logik + Router
const App = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [toast, setToast] = useState({
    message: "",
    visible: false,
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, visible: true, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingUser(false);
        return;
      }

      try {
        const res = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);

        if (res.data.role) {
          showToast(`Welcome back, ${res.data.name}! 👋`, "success");
        } else {
          showToast(
            `Welcome ${res.data.name}! Let's set up your profile`,
            "info"
          );
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      {!loadingUser && (
        <AppContent
          user={user}
          setUser={setUser}
          toast={toast}
          showToast={showToast}
        />
      )}
    </Router>
  );
};

export default App;
