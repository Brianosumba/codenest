const express = require("express");
const router = express.Router();
const {
  createSnippet,
  getUserSnippets,
  getSnippetById,
  toggleFavorite,
  updateSnippet,
} = require("../controllers/snippetController");
const verifyToken = require("../middleware/verifyToken");

//Create a new snippet
router.post("/", verifyToken, createSnippet);

//Get all snippets for logged-in user
router.get("/", verifyToken, getUserSnippets);

//Get snippet by id
router.get("/:id", verifyToken, getSnippetById);

// Toggle favorite
router.patch("/:id/favorite", verifyToken, toggleFavorite);

//Update snippet
router.put("/:id", verifyToken, updateSnippet);

module.exports = router;
