import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  PowerIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  UserIcon,
  BookOpenIcon,
  PlusIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isResourcesMenuOpen, setIsResourcesMenuOpen] = useState(false);
  const [hasNgo, setHasNgo] = useState(null); // null = loading, true = has NGO, false = no NGO
  const [user, setUser] = useState(null); // To store user data for profile pic

  const isLoggedIn = localStorage.getItem("userToken");

  // Fetch user data to check if NGO is registered and get profile pic
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (token) {
          const response = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setUser(data); // Store user data
          setHasNgo(!!data.ngo); // true if ngo exists, false if null
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setHasNgo(false); // Default to false on error
      }
    };
    if (isLoggedIn) fetchUser();
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Profile menu items with conditional NGO logic
  const profileMenuItems = [
    { label: "My Profile", icon: UserCircleIcon, action: () => navigate("/profile") },
    {
      label: hasNgo === null ? "Loading..." : hasNgo ? "NGO Profile" : "Register NGO",
      icon: UserIcon,
      action: () => navigate(hasNgo ? "/ngoprofile" : "/register"),
    },

    { label: "My Resources", icon: BookOpenIcon, action: () => navigate("/my-resources") },
    { label: "Logout", icon: PowerIcon, action: handleLogout, isDanger: true },
  ];

  const resourcesMenuItems = [
    { label: "View Resources", icon: BookOpenIcon, action: () => navigate("/resources") },
    { label: "Add Resource", icon: PlusIcon, action: () => navigate("/add-resource") },
  ];

  const renderMenuItems = (items) =>
    items.map(({ label, icon, action, isDanger }, index) => (
      <MenuItem
        key={index}
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling to parent MenuList
          action();
          // Close the menu after clicking
          if (label === "Logout") {
            setIsProfileMenuOpen(false);
          } else {
            setIsProfileMenuOpen(false);
            setIsResourcesMenuOpen(false);
          }
        }}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 w-full ${
          isDanger
            ? "hover:bg-red-50 focus:bg-red-50 text-red-600"
            : "hover:bg-blue-50 focus:bg-blue-50 text-gray-700"
        }`}
      >
        {React.createElement(icon, {
          className: `h-5 w-5 ${isDanger ? "text-red-500" : "text-blue-500"}`,
        })}
        <Typography
          as="span"
          variant="small"
          color={isDanger ? "red" : "inherit"}
          className="font-medium"
        >
          {label}
        </Typography>
      </MenuItem>
    ));

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg w-full transition-all duration-300 border-b border-gray-100/50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <a
          href="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 text-transparent bg-clip-text transition-all duration-300 transform hover:scale-105"
        >
          NGOConnect
        </a>

        {/* Centered Navigation Links */}
        <div className="flex-1 flex justify-center items-center space-x-10">
          <a
            href="/about"
            className="text-gray-700 hover:text-blue-600 font-medium text-base flex items-center transition-all duration-300 transform hover:scale-105"
          >
            About Us
          </a>
          <a
            href="/ngo-list"
            className="text-gray-700 hover:text-blue-600 font-medium text-base flex items-center transition-all duration-300 transform hover:scale-105"
          >
            Registered NGOs
          </a>
          <a
            href="/donate"
            className="text-gray-700 hover:text-blue-600 font-medium text-base flex items-center transition-all duration-300 transform hover:scale-105"
          >
            Donate
          </a>
          <Menu
            open={isResourcesMenuOpen}
            handler={setIsResourcesMenuOpen}
            animate={{
              mount: { y: 0, opacity: 1 },
              unmount: { y: -10, opacity: 0 },
            }}
          >
            <MenuHandler>
              <Button
                variant="text"
                className="text-gray-700 hover:text-blue-600 flex items-center gap-2 font-medium text-base transition-all duration-300 transform hover:scale-105 p-0"
              >
                Resources
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isResourcesMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </MenuHandler>
            <MenuList className="p-2 mt-2 rounded-xl shadow-xl border border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-200 z-50">
              {renderMenuItems(resourcesMenuItems)}
            </MenuList>
          </Menu>
        </div>

        {/* Right-Aligned Profile or Login */}
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/chat")}
              className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 transform hover:scale-110"
            >
              <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-gray-700" />
            </button>

            <Menu
              open={isProfileMenuOpen}
              handler={setIsProfileMenuOpen}
              placement="bottom-end"
              animate={{
                mount: { y: 0, opacity: 1 },
                unmount: { y: -10, opacity: 0 },
              }}
            >
              <MenuHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="flex items-center gap-2 rounded-full py-1 px-2 hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                >
                  <Avatar
                    src={
                      user?.profilePic ||
                      `https://ui-avatars.com/api/?name=${user?.ngo?.name || user?.name}&background=random`
                    }
                    alt={user?.ngo?.name || user?.name}
                    size="sm"
                    className="w-8 h-8 object-cover rounded-full border-2 border-blue-500"
                  />
                  <ChevronDownIcon
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isProfileMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </MenuHandler>
              <MenuList className="p-2 mt-2 rounded-xl shadow-xl border border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-200 z-50">
                {renderMenuItems(profileMenuItems)}
              </MenuList>
            </Menu>
          </div>
        ) : (
          <a
            href="/login"
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
}