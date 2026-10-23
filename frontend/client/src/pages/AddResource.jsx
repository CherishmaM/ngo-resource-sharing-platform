import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AddResource = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [ngoId, setNgoId] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData && userData.ngo) {
      setNgoId(userData.ngo);
    } else {
      setErrorMessage("You must register an NGO before adding resources.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ngoId) {
      setErrorMessage("Only NGO representatives can add resources.");
      return;
    }

    const resourceData = {
      ...formData,
      ngo: ngoId,
    };

    try {
      const token = localStorage.getItem("userToken");

      const response = await fetch("http://localhost:5000/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(resourceData),
      });

      if (response.ok) {
        setSuccessMessage("Resource added successfully!");
        setFormData({
          name: "",
          category: "",
          quantity: "",
          description: "",
        });
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to add resource");
      }
    } catch (error) {
      setErrorMessage("Error connecting to server.");
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
            src="https://source.unsplash.com/600x600/?donation,charity"
            alt="Resource Donation"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Right Section - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-2/3 p-10"
        >
          <h2 className="text-3xl font-bold text-gray-800">Add Resource</h2>
          <p className="text-gray-600 text-sm mt-2 mb-6">Contribute to your NGO by adding essential resources.</p>

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
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formData.name ? "bg-blue-100" : "bg-white"
                }`}
                placeholder="Enter resource name"
              />
            </motion.div>

            {/* Category Dropdown */}
            <motion.div whileFocus={{ scale: 1.02 }} className="relative">
              <label className="block text-sm font-medium text-gray-700">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formData.category ? "bg-blue-100" : "bg-white"
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
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formData.quantity ? "bg-blue-100" : "bg-white"
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
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className={`w-full p-3 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formData.description ? "bg-blue-100" : "bg-white"
                }`}
                placeholder="Enter description"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Add Resource
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddResource;
