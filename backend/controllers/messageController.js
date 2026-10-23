const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  const { receiver, content } = req.body;
  const sender = req.user.id; // From authMiddleware

  try {
    const message = new Message({ sender, receiver, content });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMessages = async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user.id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const markMessagesAsRead = async (req, res) => {
  const { receiverId } = req.params;
  const userId = req.user.id;

  try {
    await Message.updateMany(
      { sender: receiverId, receiver: userId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getLatestMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all messages where the user is either sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name ngo")
      .populate("receiver", "name ngo")
      .sort({ createdAt: -1 }); // Sort by timestamp (newest first)

    // Group messages by the other user (sender or receiver) and get the latest one
    const latestMessages = {};
    for (const msg of messages) {
      const otherUserId =
        msg.sender._id.toString() === userId
          ? msg.receiver._id.toString()
          : msg.sender._id.toString();

      if (!latestMessages[otherUserId]) {
        latestMessages[otherUserId] = {
          user: msg.sender._id.toString() === userId ? msg.receiver : msg.sender,
          latestMessage: msg,
        };
      }
    }

    // Convert to array and sort by latest message timestamp
    const result = Object.values(latestMessages).sort(
      (a, b) => new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt)
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching latest messages:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendMessage, getMessages, markMessagesAsRead, getLatestMessages };