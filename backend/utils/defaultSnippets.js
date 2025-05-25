const Snippet = require("../models/Snippet");

const defaultSnippets = [
  {
    title: "HTML Lists & Structure",
    language: "HTML",
    type: "frontend",
    category: "Markup",
    tags: ["html", "ul", "ol", "list", "structure"],
    description: `## What You'll Learn
How to create lists in HTML — both **unordered** (bulleted) and **ordered** (numbered) lists.

---

## Code Explanation

### \`<!DOCTYPE html>\`
Tells the browser this is an HTML5 document.

### \`<html>\`
Wraps the entire page content.

### \`<head>\`
Holds metadata, including the page title.

### \`<title>\`
The text shown in the browser tab.

### \`<body>\`
What the user sees — the actual page content.

### \`<ul>\`
Unordered list. Each \`<li>\` is a bullet point.

### \`<ol>\`
Ordered list. Items are shown in numbered order.

---

## Analogy

Think of:
- \`<ul>\` as a grocery list.
- \`<ol>\` as a recipe with step-by-step instructions.`,
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>HTML Lists</title>
  </head>
  <body>
    <h2>Unordered List</h2>
    <ul>
      <li>Apple</li>
      <li>Banana</li>
      <li>Orange</li>
    </ul>

    <h2>Ordered List</h2>
    <ol>
      <li>Wake up</li>
      <li>Code</li>
      <li>Sleep</li>
    </ol>
  </body>
</html>`,
    starter: true,
  },

  {
    title: "CSS Grid Layout",
    language: "CSS",
    type: "frontend",
    category: "Styling",
    tags: ["css", "grid", "layout"],
    description: `## What You'll Learn
How to use CSS Grid to build responsive layouts with rows and columns.

---

## Code Explanation

### \`.grid-container\`
- \`display: grid\` turns on grid mode
- \`grid-template-columns: repeat(3, 1fr)\` makes 3 equal columns
- \`gap\` adds spacing between grid cells
- \`padding\` adds space around the container

### \`.grid-item\`
- Background, text color, padding, rounded corners
- These are the boxes in your grid

---

## Analogy

Grid is like a **chess board** — each square is a cell where you can place content.`,
    code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.grid-item {
  background-color: #3498db;
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}`,
    starter: true,
  },

  {
    title: "JavaScript Array Methods",
    language: "JavaScript",
    type: "frontend",
    category: "Logic",
    tags: ["javascript", "arrays", "map", "filter"],
    description: `## What You'll Learn
How to use two powerful array methods: \`map()\` and \`filter()\`.

---

## Code Explanation

### \`map()\`
Creates a **new array** by transforming each element.

### \`filter()\`
Creates a **new array** by selecting certain elements based on a condition.

---

## Analogy

- \`map()\` is like rewriting every item in a to-do list
- \`filter()\` is like keeping only items that match a rule`,
    code: `const numbers = [1, 2, 3, 4, 5];

// Square each number
const squares = numbers.map(num => num * num);
console.log(squares); // [1, 4, 9, 16, 25]

// Get only even numbers
const evens = numbers.filter(num => num % 2 === 0);
console.log(evens); // [2, 4]`,
    starter: true,
  },
  {
    title: "TypeScript Basics: Types & Interfaces",
    language: "TypeScript",
    type: "frontend",
    category: "TypeScript",
    tags: ["typescript", "types", "interfaces", "safety", "annotation"],
    description: `## What You'll Learn
How to define types and interfaces in TypeScript for safer and clearer code.

---

## Code Explanation

### \`let age: number = 25;\`
Explicitly declares that \`age\` is a number.

### \`interface Person\`
Creates a contract for what a Person object should look like.

### \`function greet(person: Person)\`
Uses the Person type as a parameter – the function only accepts a matching object.

---

## Analogy

TypeScript is like using **labels on boxes**. You know exactly what's inside and avoid surprises later.`,
    code: `interface Person {
  name: string;
  age: number;
}

let age: number = 25;

function greet(person: Person): void {
  console.log(\`Hello, \${person.name}!\`);
}

const user: Person = {
  name: "Ninna",
  age: age,
};

greet(user);`,
    starter: true,
  },

  {
    title: "React useEffect Hook",
    language: "JavaScript",
    type: "frontend",
    category: "React",
    tags: ["react", "hooks", "useEffect"],
    description: `## What You'll Learn
How to use the \`useEffect\` hook to run logic when a component loads.

---

## Code Explanation

### \`useEffect(() => {}, [])\`
Runs **once** when the component mounts (like \`componentDidMount()\`).

### \`setInterval()\`
Increases the timer every second.

### \`clearInterval()\`
Cleans up the interval when the component unmounts.

---

## Analogy

- \`useEffect\` is like setting up a "start-up action" for your component
- \`setInterval\` is like setting a repeating alarm`,
    code: `import React, { useEffect, useState } from "react";

const Timer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <p>Timer: {time} seconds</p>;
};

export default Timer;`,
    starter: true,
  },

  {
    title: "Express Middleware & Routing",
    language: "JavaScript",
    type: "backend",
    category: "Node.js",
    tags: ["express", "middleware", "routes"],
    description: `## What You'll Learn
How to create a basic Express server, use middleware, and handle routes.

---

## Code Explanation

### \`const express = require("express");\`
Loads Express — a popular Node.js web framework.

### \`const app = express();\`
Initializes the app. Think of this as starting your server engine.

### \`app.use()\`
Middleware: runs on **every** request. Here it logs info.

### \`app.get("/", ...)\`
Defines a route for the home URL (\`/\`).

### \`res.send()\`
Sends a response back to the client (e.g., the browser).

### \`app.listen()\`
Starts the server and listens on port 3000.

---

## Analogy

- \`express()\` = turning on your web engine
- \`use()\` = a checkpoint every request must pass
- \`get()\` = "When someone visits this page, respond with this message"`,
    code: `const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log(\`Incoming request: \${req.method} \${req.url}\`);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});`,
    starter: true,
  },
  {
    title: "Laravel Basics: Route & Controller",
    language: "PHP",
    type: "backend",
    category: "Laravel",
    tags: ["laravel", "php", "routes", "controller", "mvc"],
    description: `## What You'll Learn
How to define a route in Laravel and connect it to a controller method.

---

## Code Explanation

### \`Route::get('/welcome', ...)\`
Creates a GET route in Laravel that listens on \`/welcome\`.

### \`[WelcomeController::class, 'index']\`
Tells Laravel to call the \`index\` method inside the \`WelcomeController\`.

### \`php artisan make:controller WelcomeController\`
Command to generate a new controller.

---

## Analogy

Think of a route like **a receptionist** it receives incoming visitors (requests) and sends them to the right office (controller).`,
    code: `// web.php (routes file)
use App\\Http\\Controllers\\WelcomeController;

Route::get('/welcome', [WelcomeController::class, 'index']);

// WelcomeController.php
namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request; 

class WelcomeController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Welcome to Laravel!']);
    }
}`,
    starter: true,
  },
  {
    title: "Python Basics: Functions & Conditions",
    language: "Python",
    type: "backend",
    category: "Python",
    tags: ["python", "function", "if", "print", "syntax"],
    description: `## What You'll Learn
Basic Python syntax: how to define a function and use an \`if\` statement.

---

## Code Explanation

### \`def greet(name):\`
Defines a function named \`greet\` with one parameter.

### \`if name:\`
Checks if a name was passed in (non-empty string).

### \`print(...)\`
Outputs text to the terminal.

---

## Analogy

Think of a Python function like a **coffee machine** – you put something in (a name), it processes, and gives you something out (a greeting).`,
    code: `def greet(name):
    if name:
        print(f"Hello, {name}!")
    else:
        print("Hello, stranger!")

greet("Ninna")
greet("")`,
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
    console.error("Failed to insert default snippets:", err);
  }
};

module.exports = generateDefaultSnippets;
