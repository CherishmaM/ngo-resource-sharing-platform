import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    email: "",
    phone: "",
    address: "",
    postal: "",
    country:"",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    if (!token) {
      setErrorMessage("You must be logged in to register an NGO.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/ngos/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("NGO registered successfully!");
        setFormData({
          name: "",
          licenseNumber: "",
          email: "",
          phone: "",
          address: "",
          postal: "",
          country:"",
        });
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setErrorMessage(`${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      setErrorMessage("Error connecting to server.");
    }
  };

  const countries = ["India", "Uganda", "USA", "UK"];
  const countryPhoneCodes = {
    USA: "+1",
    UK: "+44",
    India: "+91",
    Uganda: "+256",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-lg rounded-lg max-w-5xl w-full p-10 relative flex hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out"
      >
        {/* Left Section - Form */}
        <div className="w-2/3 pr-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Register Your NGO</h1>
          <p className="text-gray-500 mb-6">Join our platform to collaborate and make a greater impact.</p>
          <h2 className="text-xl font-semibold mb-3">NGO Information</h2>
          <p className="text-sm text-gray-500 mb-6">Fill in the details below to register your NGO.</p>

          {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">{successMessage}</div>}
          {errorMessage && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            {/* Full Name & License Number */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-700">Name of the NGO *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formData.name ? "bg-blue-100" : "bg-white"
                  }`}
                />
              </motion.div>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-700">License Number *</label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formData.licenseNumber ? "bg-blue-100" : "bg-white"
                  }`}
                />
              </motion.div>
            </div>
            
            {/*Description*/}
            <motion.div whileFocus={{ scale: 1.02 }} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description *</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formData.description ? "bg-blue-100" : "bg-white"
                }`}
              />
            </motion.div>
            
            
            {/* Country */}
            <motion.div whileFocus={{ scale: 1.02 }} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formData.country ? "bg-blue-100" : "bg-white"
                }`}
              >
                <option value="" disabled>Select your country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Address */}
            <motion.div whileFocus={{ scale: 1.02 }} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formData.address ? "bg-blue-100" : "bg-white"
                }`}
              />
            </motion.div>

            {/* Postal Code & Phone */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-700">Postal Code *</label>
                <input
                  type="text"
                  name="postal"
                  value={formData.postal}
                  onChange={handleChange}
                  required
                  className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                    formData.postal ? "bg-blue-100" : "bg-white"
                  }`}
                />
              </motion.div>
              <motion.div whileFocus={{ scale: 1.02 }}>
                <label className="block text-sm font-medium text-gray-700">Phone *</label>
                <div className="flex">
                  <span
                    className="inline-flex items-center px-3 rounded-l-lg border border-r-0 bg-gray-100 text-gray-600"
                  >
                    {countryPhoneCodes[formData.country] || ""}
                  </span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={`w-full p-2 border rounded-r-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                      formData.phone ? "bg-blue-100" : "bg-white"
                    }`}
                    placeholder="Enter phone number"
                  />
                </div>
              </motion.div>
            </div>

            {/* Email */}
            <motion.div whileFocus={{ scale: 1.02 }} className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  formData.email ? "bg-blue-100" : "bg-white"
                }`}
              />
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#2563eb" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Register
            </motion.button>
          </form>
        </div>

        {/* Right Section - Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-1/3 flex justify-end"
        >
          <img
            src="/Register.png"
            alt="NGO Registration"
            className="rounded-lg shadow-md transition-transform duration-300 ease-in-out hover:scale-110"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
