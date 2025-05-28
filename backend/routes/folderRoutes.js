const express = require("express");
const router = express.Router();

const {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
} = require("../controllers/folderController");

const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, getFolders);
router.post("/", verifyToken, createFolder);
router.put("/:id", verifyToken, updateFolder);
router.delete("/:id", verifyToken, deleteFolder);

module.exports = router;
