import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import io from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token: localStorage.getItem("userToken") },
});

const Donate = () => {
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState("");
  const [resourceName, setResourceName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null); // To store the current user
  const navigate = useNavigate();

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("userToken");
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching user:", error);
          setErrorMessage("Failed to load user data.");
        }
      }
    };
    fetchUser();
  }, []);

  // Fetch all NGOs
  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ngos");
        const data = await response.json();
        setNgos(data);
      } catch (error) {
        setErrorMessage("Failed to fetch NGOs");
      }
    };

    fetchNgos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const donationData = {
      resourceName,
      category,
      quantity,
      description,
      ngo: selectedNgo,
    };

    try {
      // Submit the donation
      const response = await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to make donation");
      }

      const data = await response.json();
      const receiverId = data.receiverId;
      if (!receiverId) {
        throw new Error("Receiver ID not found in response");
      }

      // Fetch all users to find the NGO owner
      const usersResponse = await fetch("http://localhost:5000/api/users/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersResponse.json();
      const ngoUser = usersData.find((u) => u._id === receiverId);
      if (!ngoUser) {
        throw new Error("NGO owner not found");
      }

      const donationMessage = 
      `"Hello, I would love to support by donating ${quantity} ${category} of ${resourceName}. Let me know how I can proceed!"
      `.trim();
      // Show a success toast
      toast.success("Donation successful! Message sent to the NGO.");

      // Send a predefined message to the NGO user
      socket.emit("sendMessage", {
        sender: user._id,
        receiver: receiverId,
        content: donationMessage,
        token,
      });

      setSuccessMessage("Donation made successfully! Message sent to the NGO.");
      setResourceName("");
      setCategory("");
      setQuantity("");
      setDescription("");
      setSelectedNgo("");
      setErrorMessage("");

      // Redirect to chat with the NGO user
      navigate("/chat", { state: { selectedUser: ngoUser } });
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "Error connecting to server.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-5xl flex overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
      >
        {/* Left Section - Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-1/3"
        >
          <img
            src="/Donate2.jpg"
            alt="Charity"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Right Section - Donation Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-2/3 p-10"
        >
          <h2 className="text-3xl font-bold text-gray-800">Donate Resources</h2>
          <p className="text-gray-600 text-sm mt-2 mb-6">Your contributions make a difference.</p>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resource Name */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <label className="block text-sm font-medium text-gray-700">Resource Name *</label>
              <input
                type="text"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                required
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  resourceName ? "bg-blue-100" : "bg-white"
                }`}
                placeholder="Enter resource name"
              />
            </motion.div>

            {/* Category Dropdown */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  category ? "bg-blue-100" : "bg-white"
                }`}
              >
                <option value="" disabled>Select a category</option>
                <option value="Stationary">Stationary</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Clothing">Clothing</option>
              </select>
            </motion.div>

            {/* Quantity Dropdown */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <label className="block text-sm font-medium text-gray-700">Quantity *</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  quantity ? "bg-blue-100" : "bg-white"
                }`}
              >
                <option value="" disabled>Select quantity</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Description */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  description ? "bg-blue-100" : "bg-white"
                }`}
                placeholder="Write a description..."
              />
            </motion.div>

            {/* Select NGO */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <label className="block text-sm font-medium text-gray-700">Select NGO *</label>
              <select
                value={selectedNgo}
                onChange={(e) => setSelectedNgo(e.target.value)}
                required
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  selectedNgo ? "bg-blue-100" : "bg-white"
                }`}
              >
                <option value="" disabled>Select an NGO</option>
                {ngos.map((ngo) => (
                  <option key={ngo._id} value={ngo._id}>
                    {ngo.name}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Donate
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Donate;