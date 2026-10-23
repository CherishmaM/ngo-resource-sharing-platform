import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {toast} from "react-hot-toast"; // Import toast

const NGOProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    country: "",
    licenseNumber: "",
    postalCode: "",
    address: "",
    profilePic: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ngoId, setNgoId] = useState(null); // Store ngoId

  const countries = ["India", "Uganda", "USA", "UK"];
  const countryPhoneCodes = {
    USA: "+1",
    UK: "+44",
    India: "+91",
    Uganda: "+256",
  };

  useEffect(() => {
    const fetchNgoProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });
        const data = await response.json();
        if (data.ngo) {
          setNgoId(data.ngo._id); // Store ngoId
          setUserInfo({
            name: data.ngo.name || "",
            email: data.ngo.email || "",
            phone: data.ngo.phone || "",
            description: data.ngo.description || "",
            country: data.ngo.country || "",
            licenseNumber: data.ngo.licenseNumber || "",
            postalCode: data.ngo.postal || "",
            address: data.ngo.address || "",
            profilePic: data.ngo.profilePic || "",
          });
        } else {
          console.log("No NGO linked to this user");
        }
      } catch (error) {
        console.error("Error fetching NGO profile:", error);
      }
    };

    fetchNgoProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo({ ...userInfo, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ngos/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify(userInfo),
      });
      if (response.ok) {
        const updatedNgo = await response.json();
        setUserInfo({
          ...userInfo,
          ...updatedNgo, // Update state with backend response
        });
        setEditMode(false);
        toast.success("NGO Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error saving NGO profile:", error);
      toast.error("Error saving profile. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex justify-center items-center bg-blue-100 p-10"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-lg max-w-5xl w-full flex overflow-hidden"
      >
        {/* Left Sidebar - Profile Picture */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-1/3 bg-blue-50 flex flex-col items-center py-10 border-r"
        >
          <label htmlFor="profile-upload" className="relative w-24 h-24 cursor-pointer">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={editMode ? { scale: 1.1 } : {}}
              src={userInfo.profilePic || "https://via.placeholder.com/120"}
              className="w-24 h-24 rounded-full shadow-md border-2 border-blue-300 object-cover"
            />
            {editMode && (
              <>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full text-white text-xs text-center p-2 opacity-0 hover:opacity-100 transition-opacity"
                  whileHover={{ scale: 1.1 }}
                >
                  Click to upload
                </motion.div>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </>
            )}
          </label>
          <h2 className="mt-4 text-lg font-semibold">{userInfo.name || "NGO Name"}</h2>
          <p className="text-gray-500">{userInfo.email}</p>
        </motion.div>

        {/* Right Section - Profile Settings */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-2/3 p-10"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">NGO Profile</h2>
          <p className="text-gray-600 mb-6">Manage your account details below</p>

          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <label className="block text-sm font-medium text-gray-600">NGO Name</label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <label className="block text-sm font-medium text-gray-600">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={userInfo.licenseNumber}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </motion.div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Description</label>
            <input
              type="text"
              name="description"
              value={userInfo.description}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
              disabled={!editMode}
              className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <label className="block text-sm font-medium text-gray-600">Country</label>
              <select
                name="country"
                value={userInfo.country}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <div className="flex">
                <span className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-l-md w-16 text-center">
                  {countryPhoneCodes[userInfo.country] || "+--"}
                </span>
                <input
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full p-2 border rounded-r-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <label className="block text-sm font-medium text-gray-600">Postal Code</label>
              <input
                type="text"
                name="postalCode"
                value={userInfo.postalCode}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <input
                type="text"
                name="address"
                value={userInfo.address}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => (editMode ? handleSave() : setEditMode(true))}
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            {editMode ? "Save Profile" : "Edit Profile"}
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NGOProfile;