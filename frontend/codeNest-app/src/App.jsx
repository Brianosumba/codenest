import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

const App = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

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
      {!loadingUser && <Navbar user={user} setUser={setUser} />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-snippet" element={<CreateSnippet />} />
        <Route path="/snippet/:id" element={<SnippetDetail />} />
        <Route path="/edit-snippet/:id" element={<EditSnippet />} />
        <Route path="/shared" element={<SharedSnippets />} />
      </Routes>
    </Router>
  );
};

export default App;
