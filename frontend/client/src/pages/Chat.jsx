import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { Typography, Avatar, Input, Button } from "@material-tailwind/react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { format, isToday, isYesterday } from "date-fns";

const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("userToken") },
});

export default function Chat({ selectedUser }) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("userToken");
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            setError("Failed to load user data. Please log in again.");
            localStorage.removeItem("userToken");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setError("Failed to load user data. Please try again.");
          localStorage.removeItem("userToken");
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (user && user._id && !socket.authenticated) {
      socket.emit("authenticate", localStorage.getItem("userToken"));
      socket.authenticated = true;
    }

    socket.on("receiveMessage", (newMessage) => {
      if (!user || !selectedUser) return;
      if (
        (newMessage.sender === user._id && newMessage.receiver === selectedUser._id) ||
        (newMessage.sender === selectedUser._id && newMessage.receiver === user._id)
      ) {
        setMessages((prev) => {
          const isDuplicate = prev.some((msg) => msg._id === newMessage._id);
          return isDuplicate ? prev : [...prev, { ...newMessage, animate: true }];
        });
      }
    });

    return () => socket.off("receiveMessage");
  }, [user, selectedUser]);

  useEffect(() => {
    if (selectedUser && selectedUser._id && user && user._id) {
      fetchMessages();
      markMessagesAsRead();
    }
  }, [selectedUser, user]);

  useEffect(() => scrollToBottom(), [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();
      setMessages(data.map((msg) => ({ ...msg, animate: false })));
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
    }
  };

  const markMessagesAsRead = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/mark-read/${selectedUser._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      if (!response.ok) throw new Error("Failed to mark messages as read");
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !user || !selectedUser) return;
    const token = localStorage.getItem("userToken");
    socket.emit("sendMessage", {
      sender: user._id,
      receiver: selectedUser._id,
      content: message,
      token,
    });
    setMessage("");
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isToday(date)) return format(date, "h:mm a");
    if (isYesterday(date)) return `Yesterday, ${format(date, "h:mm a")}`;
    return format(date, "MMM d, yyyy, h:mm a");
  };

  if (!user || !user._id) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Typography color="gray" className="text-lg animate-pulse">
          Please log in to start chatting.
        </Typography>
      </div>
    );
  }

  if (!selectedUser || !selectedUser._id) {
    return (
      <div className="flex-1 flex items-center justify-center bg-sky-100">
        <Typography color="gray" className="text-lg animate-fade-in">
          Select a user to start messaging.
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full w-full transition-all duration-300">
      <div className="flex flex-col h-full w-full bg-white/90 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-sky-100 flex items-center gap-3 shadow-md">
          <Avatar
            src={selectedUser.profilePic || `https://ui-avatars.com/api/?name=${selectedUser.ngo?.name || selectedUser.name}&background=random`}
            alt={selectedUser.ngo?.name || selectedUser.name}
            size="md"
            className="border-2 border-white transform hover:scale-110 transition-transform"
          />
          <Typography variant="h5" className="text-white font-bold">
            {selectedUser.ngo?.name || selectedUser.name}
          </Typography>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {error && (
            <Typography color="red" className="text-center animate-fade-in">
              {error}
            </Typography>
          )}
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.sender === user._id ? "justify-end" : "justify-start"
              } ${msg.animate ? "animate-chat-slide" : ""}`}
            >
              <div
                className={`flex items-end gap-3 max-w-[60%] ${
                  msg.sender === user._id ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar
                  src={
                    msg.sender === user._id
                      ? (user.profilePic || 
                         `https://ui-avatars.com/api/?name=${user.ngo?.name || user.name}&background=random`)
                      : (selectedUser.profilePic || 
                         `https://ui-avatars.com/api/?name=${selectedUser.ngo?.name || selectedUser.name}&background=random`)
                  }
                  alt={
                    msg.sender === user._id
                      ? (user.ngo?.name || user.name)
                      : (selectedUser.ngo?.name || selectedUser.name)
                  }
                  size="sm"
                  className="w-8 h-8 mb-2 object-cover rounded-full opacity-80 hover:opacity-100 transition-opacity"
                />
                <div className="flex flex-col">
                  <div
                    className={`p-3 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 ${
                      msg.sender === user._id
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                    }`}
                  >
                    <Typography variant="body1">{msg.content}</Typography>
                  </div>
                  <Typography
                    variant="small"
                    color="gray"
                    className={`mt-1 text-xs opacity-75 ${
                      msg.sender === user._id ? "text-right" : "text-left"
                    }`}
                  >
                    {formatTimestamp(msg.createdAt)}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 border-t border-gray-200 flex items-center gap-3">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="!border !border-gray-300 rounded-full bg-gray-100/80 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200 w-full py-2 px-4"
            labelProps={{ className: "hidden" }}
          />
          <Button
            onClick={sendMessage}
            color="blue"
            className="flex items-center gap-2 px-5 py-2 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span>Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}