const Snippet = require("../models/Snippet");

const defaultSnippets = [
  {
    title: "HTML Basics",
    language: "HTML",
    type: "frontend",
    category: "Frontend",
    tags: ["html", "structure", "elements"],
    description: "## HTML Basics\nHär är ett exempel på enkel HTML-struktur.",
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
  </body>
</html>`,
    starter: true,
  },
  {
    title: "CSS Flexbox Layout",
    language: "CSS",
    type: "frontend",
    category: "Styling",
    tags: ["css", "flexbox", "layout"],
    description:
      "## CSS Flexbox\nExempel på flexibel layout med `display: flex`.",
    code: `.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.item {
  background-color: #4caf50;
  color: white;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
}`,
    starter: true,
  },

  {
    title: "JavaScript Basics",
    language: "JavaScript",
    type: "frontend",
    category: "Logic",
    tags: ["javascript", "variables", "functions"],
    description: "## JS Basics\nVariabler, funktioner och console.log!",
    code: `const name = "Max";
function greet(name) {
  console.log("Hello, " + name + "!");
}
greet(name);`,
    starter: true,
  },
  {
    title: "React Counter Component",
    language: "JavaScript",
    type: "frontend",
    category: "React",
    tags: ["react", "hooks", "useState", "counter"],
    description:
      "## React Counter\nEn enkel komponent som räknar med `useState`.",
    code: `import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};

export default Counter;`,
    starter: true,
  },

  {
    title: "Express Basics",
    language: "JavaScript",
    type: "backend",
    category: "Node.js",
    tags: ["express", "server", "routes"],
    description: "## Express Basics\nEnkel server med en GET-route.",
    code: `const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`,
    starter: true,
  },
];

const generateDefaultSnippets = async (userId) => {
  const withUser = defaultSnippets.map((snippet) => ({
    ...snippet,
    userId: userId,
    isFavorite: false,
    isShared: false,
    starter: true,
  }));

  try {
    await Snippet.insertMany(withUser);
    console.log("Default snippets inserted for user:", userId);
  } catch (err) {
    console.error(" Failed to insert default snippets:", err);
  }
};

module.exports = generateDefaultSnippets;
