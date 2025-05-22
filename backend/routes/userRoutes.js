const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getMe } = require("../controllers/userController");
const { updateMe } = require("../controllers/userController");

router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);

module.exports = router;
