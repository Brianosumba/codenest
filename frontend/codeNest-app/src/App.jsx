import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  return (
    <Router>
      <Navbar />
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
