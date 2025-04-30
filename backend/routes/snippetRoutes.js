const express = require("express");
const router = express.Router();
const {
  createSnippet,
  getUserSnippets,
} = require("../controllers/snippetController");
const verifyToken = require("../middleware/verifyToken");

//Create a new snippet
router.post("/", verifyToken, createSnippet);

//Get all snippets for logged-in user
router.get("/", verifyToken, getUserSnippets);

module.exports = router;
