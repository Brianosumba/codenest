const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const snippetRoutes = require("./routes/snippetRoutes");
const userRoutes = require("./routes/userRoutes");
const folderRoutes = require("./routes/folderRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Render/proxy-friendly (bra best practice)
app.set("trust proxy", 1);

// Middleware
app.use(express.json());

// CORS (best practice): tillåt localhost + din Netlify URL via env
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL, // sätts på Render till din Netlify URL, ex https://dinapp.netlify.app
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Tillåt requests utan origin (t.ex. Postman) + tillåt whitelisted origins
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/users", userRoutes);
app.use("/api/folders", folderRoutes);

// Health check (bra för Render + snabb test)
app.get("/api/health", (req, res) => res.json({ ok: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
