import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Landing from "./components/Landing";
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
import FolderDetails from "./components/FolderDetails";

// Inre komponent där useNavigate fungerar
const AppContent = ({ toast, showToast }) => {
  const navigate = useNavigate();
  const { user, needRoleSetup } = useAuth();

  return (
    <>
      <Navbar user={user} />

      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
      />

      {/* Visa modal om användaren inte har valt roll */}
      {needRoleSetup && (
        <RoleModal
          showToast={showToast}
          onClose={() => navigate("/dashboard")}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Landing />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

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
              <ProfileSettings showToast={showToast} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/folders/:id"
          element={
            <ProtectedRoute user={user}>
              <FolderDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

// Yttre komponent: bara auth och toast
const App = () => {
  const { loading } = useAuth();

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

  return (
    <Router>
      {!loading && <AppContent toast={toast} showToast={showToast} />}
    </Router>
  );
};
export default App;
