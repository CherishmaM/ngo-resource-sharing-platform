import React, { useState, useEffect } from "react";
import { Typography, Avatar, Chip, Input, Button } from "@material-tailwind/react";
import { BuildingOfficeIcon, UserIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function ChatList({ setSelectedUser, selectedUser }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

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
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/all", {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users. Please try again.");
      }
    };

    const fetchUnreadMessages = async () => {
      if (!user) return;
      try {
        const unreadCounts = {};
        for (const u of users) {
          const response = await fetch(`http://localhost:5000/api/messages/${u._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
          });
          if (response.ok) {
            const messages = await response.json();
            const unreadCount = messages.filter(
              (msg) => msg.sender === u._id && msg.receiver === user._id && !msg.read
            ).length;
            unreadCounts[u._id] = unreadCount;
          }
        }
        setUnreadMessages(unreadCounts);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    if (user) {
      fetchUsers();
      fetchUnreadMessages();
    }
  }, [user, users]);

  const filteredUsers = users.filter((u) => {
    const name = u.ngo?.name || u.name;
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "All" || (filter === "Individuals" && !u.ngo) || (filter === "NGOs" && u.ngo);
    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return (
      <div className="w-1/3 flex items-center justify-center bg-gray-50">
        <Typography color="gray" className="text-lg animate-pulse">
          Please log in to view the chat list.
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-white shadow-xl border-r overflow-y-auto transition-all duration-300">
      <div className="p-6 sticky top-0 bg-white z-10 border-b">
        <Typography variant="h5" className="font-bold text-gray-800 mb-4">
          Chats
        </Typography>

        {/* Search Box */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="!border !border-gray-300 rounded-full bg-gray-100/80 pl-10 py-2 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {["All", "Individuals", "NGOs"].map((f) => (
            <Button
              key={f}
              size="sm"
              className={`px-4 py-2 rounded-full shadow-sm transform transition-all duration-200 ${
                filter === f
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-2">
        {error && (
          <Typography color="red" className="text-center animate-fade-in">
            {error}
          </Typography>
        )}
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => setSelectedUser(u)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedUser?._id === u._id
                  ? "bg-blue-100 border-l-4 border-blue-500"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={u.profilePic || `https://ui-avatars.com/api/?name=${u.ngo?.name || u.name}&background=random`}
                  alt={u.ngo?.name || u.name}
                  size="sm"
                  className="w-10 h-10 mb-2 object-cover rounded-full opacity-80 hover:opacity-100 transition-opacity"
                />
                <div className="flex flex-col">
                  <Typography className="font-medium text-gray-800">
                    {u.ngo?.name || u.name}
                  </Typography>
                  {u.ngo ? (
                    <Chip
                      value="NGO"
                      size="sm"
                      color="blue"
                      icon={<BuildingOfficeIcon className="h-4 w-4" />}
                      className="text-xs px-4 py-0.5 w-fit mt-1"
                    />
                  ) : (
                    <Chip
                      value="Individual"
                      size="sm"
                      color="green"
                      icon={<UserIcon className="h-4 w-4" />}
                      className="text-xs px-4 py-0.5 w-fit mt-1"
                    />
                  )}
                </div>
              </div>
              {unreadMessages[u._id] > 0 && (
                <span className="bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages[u._id]}
                </span>
              )}
            </div>
          ))
        ) : (
          <Typography color="gray" className="mt-4 text-center animate-fade-in">
            No users found
          </Typography>
        )}
      </div>
    </div>
  );
}