const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getMe,
  updateMe,
  getAvailableRoles,
} = require("../controllers/userController");

router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);
router.get("/roles", getAvailableRoles);

module.exports = router;
