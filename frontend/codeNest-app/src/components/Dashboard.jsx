import React from "react";
import "../styles/dashboard.css";

const Dashboard = () => {
  const username = localStorage.getItem("username") || "User"; // Placeholder tills vi bygger auth-context

  //Dummy data
  const snippetsCount = 12;
  const CategoriesCount = 5;
  const favoritesCount = 4;
  const recentSnippets = [
    {
      id: 1,
      title: "React State Basics",
    },
    {
      id: 2,
      title: "Express Route Example",
    },
    {
      id: 1,
      title: "MongoDB Connection Snippet",
    },
  ];
  return (
    <div className="dashboard-container">
      <div className="welcome-card">
        <h1>Welcome to CodeNest, {username}!</h1>
        <p>Manage your code snippets and learning journey easily</p>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h2>My Snippets</h2>
          <p>{snippetsCount}</p>
        </div>
        <div className="card">
          <h2>Categories</h2>
          <p>{CategoriesCount}</p>
        </div>
        <div className="card">
          <h2>Favorites</h2>
          <p>{favoritesCount}</p>
        </div>
      </div>

      <div className="recent-snippets">
        <h2>Recent Snippets</h2>
        <ul>
          {recentSnippets.map((snippet) => (
            <li key={snippet.id}>{snippet.title}</li>
          ))}
        </ul>
      </div>

      <div className="cta-snippet">
        <button>Create new Snippet</button>
      </div>
    </div>
  );
};

export default Dashboard;
