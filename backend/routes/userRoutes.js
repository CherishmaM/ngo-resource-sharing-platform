const authMiddleware = require("../middleware/authMiddleware");
const express = require('express');
const { registerUser, loginUser, getUserProfile, getAllUsers, getCurrentUser, updateUserProfile, changePassword, getUserById } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/profile", authMiddleware, getUserProfile); // Now protected
router.get("/all", authMiddleware, getAllUsers); 
router.get("/me", authMiddleware, getCurrentUser);
router.put("/me", authMiddleware, updateUserProfile); // Now protected
router.put("/change-password", authMiddleware, changePassword);
router.get("/:id", authMiddleware, getUserById); // Now protected


module.exports = router;
