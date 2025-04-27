const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Skyddad route nådd!",
    user: req.user,
  });
});
module.exports = router;
