const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", register);

router.post("/login", login);

router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Skyddad route nådd!",
    user: req.user,
  });
});
module.exports = router;
