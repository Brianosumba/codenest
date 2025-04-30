const express = require("express");
const router = express.Router();
const {
  createSnippet,
  getUserSnippets,
  getSnippetById,
} = require("../controllers/snippetController");
const verifyToken = require("../middleware/verifyToken");

//Create a new snippet
router.post("/", verifyToken, createSnippet);

//Get all snippets for logged-in user
router.get("/", verifyToken, getUserSnippets);

//Get snippet by id
router.get("/:id", verifyToken, getSnippetById);

module.exports = router;
