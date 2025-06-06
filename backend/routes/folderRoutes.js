const express = require("express");
const router = express.Router();

const {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
  getFolderWithSnippets,
  addSnippetToFolder,
  removeSnippetFromFolder,
} = require("../controllers/folderController");

const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, getFolders);
router.post("/", verifyToken, createFolder);
router.put("/:id", verifyToken, updateFolder);
router.delete("/:id", verifyToken, deleteFolder);
router.get("/:id", verifyToken, getFolderWithSnippets);
router.patch("/:id/add-snippet", verifyToken, addSnippetToFolder);
router.patch("/:id/remove-snippet", verifyToken, removeSnippetFromFolder);

module.exports = router;
