const express = require("express");
const { sendMessage, getMessages, markMessagesAsRead, getLatestMessages } = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/latest", authMiddleware, getLatestMessages);

router.post("/", authMiddleware, sendMessage);
router.get("/:receiverId", authMiddleware, getMessages);
router.put("/mark-read/:receiverId", authMiddleware, markMessagesAsRead);
router.get("/latest", authMiddleware, getLatestMessages);

module.exports = router;