import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatList from "./ChatList";
import Chat from "./Chat";

export default function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  // Handle selectedUser from state (from Donate.jsx)
  useEffect(() => {
    if (location.state?.selectedUser) {
      console.log("Setting selectedUser from location.state:", location.state.selectedUser);
      setSelectedUser(location.state.selectedUser);
    }
  }, [location.state]);

  // Handle userId from query parameter (from Resources.jsx)
  useEffect(() => {
    const fetchUserFromQuery = async () => {
      const params = new URLSearchParams(location.search);
      const userId = params.get("userId");
      if (userId && !selectedUser) {
        try {
          const token = localStorage.getItem("userToken");
          const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          const userData = await response.json();
          setSelectedUser(userData);
          // Optionally clear the query param for a cleaner URL
          navigate("/chat", { replace: true });
        } catch (error) {
          console.error("Error fetching user from query:", error);
        }
      }
    };

    fetchUserFromQuery();
  }, [location.search, navigate, selectedUser]);

  return (
    <div className="flex h-[calc(100vh-80px)]">
      <ChatList setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
      <Chat selectedUser={selectedUser} />
    </div>
  );
}