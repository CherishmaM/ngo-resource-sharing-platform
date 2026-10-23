const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Store connected users' sockets
const connectedUsers = new Map();

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/ngos", require("./routes/ngoRoutes"));
app.use("/api/resources", require("./routes/resourceRoutes"));
app.use("/api/donations", require("./routes/donationRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));

// Socket.io
io.on("connection", (socket) => {
  console.log("A user connected with socket ID:", socket.id);

  socket.on("authenticate", (token) => {
    console.log("Received authenticate event with token:", token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      socket.userId = userId;
      connectedUsers.set(userId, socket);
      console.log("User authenticated:", userId);
      console.log("Current connected users:", Array.from(connectedUsers.keys()));
    } catch (error) {
      console.error("Authentication error:", error);
      socket.disconnect();
    }
  });

  socket.on("sendMessage", async (message) => {
    console.log("Received sendMessage event with socket:", socket.id, "message:", message);
    try {
      // Use the token from the initial authentication
      const token = message.token; // Rely on token passed from frontend
      if (!token) {
        console.error("No token provided in sendMessage event");
        return;
      }
      console.log("Using token for fetch:", token);

      const response = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Use the authenticated token
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        const savedMessage = await response.json();
        console.log("Message saved to DB:", savedMessage);

        const receiverSocket = connectedUsers.get(message.receiver);
        if (receiverSocket) {
          console.log(`Emitting receiveMessage to receiver: ${message.receiver}`);
          receiverSocket.emit("receiveMessage", savedMessage);
        } else {
          console.log(`Receiver not found in connectedUsers: ${message.receiver}`);
        }

        if (socket.userId && socket.userId !== message.receiver) {
          console.log(`Emitting receiveMessage to sender: ${socket.userId}`);
          socket.emit("receiveMessage", savedMessage);
        }
      } else {
        console.error("Failed to save message to DB:", response.statusText, "Status:", response.status);
      }
    } catch (error) {
      console.error("Error sending message via socket:", error);
    }
  });

  socket.on("disconnect", () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log("User disconnected:", socket.userId);
      console.log("Current connected users:", Array.from(connectedUsers.keys()));
    }
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});