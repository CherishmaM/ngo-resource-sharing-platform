import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {toast} from "react-hot-toast"; // Import toast

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    country: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          toast.error("Failed to fetch profile");
        }
        const data = await response.json();
        console.log("Fetched user data:", data);
        setUserInfo({
          ...userInfo,
          name: data.name || "",
          email: data.email || "",
          country: data.country || "",
          phone: data.phone || "",
          profilePic: data.profilePic || "https://via.placeholder.com/120",
        });
      } catch (error) {
        toast.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const countries = ["India", "Uganda", "USA", "UK"];
  const countryPhoneCodes = {
    USA: "+1",
    UK: "+44",
    India: "+91",
    Uganda: "+256",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo({ ...userInfo, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("http://localhost:5000/api/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userInfo.name,
          country: userInfo.country,
          phone: userInfo.phone,
          profilePic: userInfo.profilePic,
        }),
      });
      if (!response.ok) {
        toast.error("Failed to update profile");
      }
      const updatedData = await response.json();
      setUserInfo({ ...userInfo, ...updatedData }); // Merge updated data
      setEditMode(false);
      console.log("Profile updated:", updatedData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validation
      if (!userInfo.oldPassword || !userInfo.newPassword || !userInfo.confirmPassword) {
        toast.error("Please fill all password fields");
        return;
      }
      if (userInfo.newPassword !== userInfo.confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }
      if (userInfo.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters");
        return;
      }

      const token = localStorage.getItem("userToken");
      const response = await fetch("http://localhost:5000/api/users/change-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: userInfo.oldPassword,
          newPassword: userInfo.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to change password");
      }

      const data = await response.json();
      toast.success(data.message); // "Password updated successfully"
      setUserInfo({
        ...userInfo,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }); // Clear password fields
      setChangePasswordMode(false); // Exit change password mode
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.message || "Error changing password");
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
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full flex overflow-hidden"
      >
        {/* Left Sidebar - Profile Info */}
        <div className="w-1/3 bg-blue-50 flex flex-col items-center py-10 border-r">
          <label htmlFor="profile-upload" className="relative w-24 h-24 cursor-pointer">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={editMode ? { scale: 1.1 } : {}}
              src={userInfo.profilePic}
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
                  onChange={handleProfilePicChange}
                />
              </>
            )}
          </label>

          <h2 className="mt-4 text-lg font-semibold">{userInfo.name || "User Name"}</h2>
          <p className="text-gray-500">{userInfo.email}</p>
        </div>

        {/* Right Section - Profile Settings */}
        <div className="w-2/3 p-10">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Profile</h2>
          <p className="text-gray-600 mb-6">Manage your account details below</p>

          <div className="grid grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.05 }}>
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={userInfo.name}
                onChange={handleInputChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg transition-all ${
                  !editMode
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:shadow-md focus:ring-2 focus:ring-blue-500"
                }`}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={userInfo.email}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <motion.div whileHover={{ scale: 1.05 }}>
              <label className="block text-sm font-medium text-gray-600">Country</label>
              <select
                name="country"
                value={userInfo.country}
                onChange={handleInputChange}
                disabled={!editMode}
                className="w-full p-2 border rounded-lg transition-all focus:ring-blue-500 focus:border-blue-500"
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
                  {countryPhoneCodes[userInfo.country] || ""}
                </span>
                <input
                  type="text"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full p-2 border rounded-r-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all"
              onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
            >
              {editMode ? "Save Profile" : "Edit Profile"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-yellow-500 text-white px-6 py-3 rounded-md hover:bg-yellow-600 transition-all"
              onClick={() => setChangePasswordMode(!changePasswordMode)}
            >
              Change Password
            </motion.button>
          </div>

          {/* Change Password Section */}
          {changePasswordMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <div className="grid grid-cols-2 gap-6">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <label className="block text-sm font-medium text-gray-600">Old Password</label>
                  <input
                    type="password"
                    name="oldPassword"
                    value={userInfo.oldPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <label className="block text-sm font-medium text-gray-600">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={userInfo.newPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={userInfo.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </motion.div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-4 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-all"
                onClick={handleChangePassword}
              >
                Save Password
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;