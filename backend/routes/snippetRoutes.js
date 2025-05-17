const express = require("express");
const router = express.Router();
const {
  createSnippet,
  getUserSnippets,
  getSnippetById,
  toggleFavorite,
  updateSnippet,
  deleteSnippet,
  shareSnippet,
  getSharedSnippets,
} = require("../controllers/snippetController");
const verifyToken = require("../middleware/verifyToken");

//Get Shared Snippets
router.get("/shared", getSharedSnippets);

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

//Delete snippet
router.delete("/:id", verifyToken, deleteSnippet);

//Share snippet
router.patch("/:id/share", verifyToken, shareSnippet);

module.exports = router;
