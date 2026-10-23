import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Modal from "../components/Modal";
import { toast } from "react-hot-toast";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [sortedResources, setSortedResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [userHasNgo, setUserHasNgo] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }
        const response = await fetch("http://localhost:5000/api/resources", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }
        const data = await response.json();
        setResources(data);
        setSortedResources(data);
        const uniqueCategories = [...new Set(data.map((resource) => resource.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (token) {
          const response = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          const data = await response.json();
          setUserHasNgo(!!data.ngo);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchResources();
    fetchUser();
  }, []);

  const handleContactClick = (ngo) => {
    setSelectedNgo(ngo);
    setIsModalOpen(true);
  };

  const handleRequestResource = async (resourceId) => {
    try {
      const token = localStorage.getItem("userToken");
      if (!token) {
        alert("Please log in to request a resource");
        navigate("/login");
        return;
      }

      if (!userHasNgo) {
        alert("You must register an NGO to request resources");
        navigate("/register-ngo");
        return;
      }

      const response = await fetch("http://localhost:5000/api/resources/request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resourceId }),
      });

      toast.success("Resource requested successfully");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to request resource");
      }

      const data = await response.json();
      alert(data.message);
      navigate(`/chat?userId=${data.receiverId}`);
    } catch (error) {
      console.error("Error requesting resource:", error);
      alert(error.message || "Error sending request");
    }
  };

  const sortResources = (order) => {
    const sorted = [...resources].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (order === "asc") {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
    setSortedResources(sorted);
    setSortOrder(order);
  };

  const filteredResources = sortedResources.filter((resource) => (
    (selectedCategory === "" || resource.category === selectedCategory) &&
    (searchQuery === "" || resource.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ));

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-200 p-6 md:p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
      >
        Available Resources
      </motion.h1>

      {/* Search, Filter, and Sorting Section */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 w-full max-w-7xl">
        <input
          type="text"
          placeholder="🔍 Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3 transition-all duration-300 hover:shadow-lg bg-white"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-1/3 transition-all duration-300 hover:shadow-lg bg-white"
        >
          <option value="">📂 All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sortResources("asc")}
            className={`px-4 py-2 rounded-lg shadow-md transition-all ${
              sortOrder === "asc"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Sort A-Z
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sortResources("desc")}
            className={`px-4 py-2 rounded-lg shadow-md transition-all ${
              sortOrder === "desc"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Sort Z-A
          </motion.button>
        </div>
      </div>

      {/* Resources List */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"
      >
        {loading ? (
          Array(3)
            .fill()
            .map((_, index) => <SkeletonCard key={index} />)
        ) : filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <motion.div
              key={resource._id}
              whileHover={{ scale: 1.03, boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-start bg-gradient-to-br from-blue-50 to-blue-100"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{resource.name}</h2>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">📌 Category:</span> {resource.category}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">📦 Quantity:</span> {resource.quantity}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">📝 Description:</span> {resource.description}
              </p>
              <p className="text-blue-700 font-semibold text-sm mb-4">
                🏢 NGO: {resource.ngo.name}
              </p>
              <div className="flex gap-4 mt-auto">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#1D4ED8" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleContactClick(resource.ngo)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
                >
                  Contact NGO
                </motion.button>
                <motion.button
                  whileHover={
                    userHasNgo ? { scale: 1.05, backgroundColor: "#15803D" } : {}
                  }
                  whileTap={userHasNgo ? { scale: 0.95 } : {}}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleRequestResource(resource._id)}
                  disabled={!userHasNgo}
                  className={`px-5 py-2 rounded-lg shadow-md transition-all ${
                    userHasNgo
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }`}
                >
                  Request Resource
                </motion.button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full col-span-3 text-lg">
            No resources found.
          </p>
        )}
      </motion.div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} ngo={selectedNgo} />
    </div>
  );
};

export default Resources;