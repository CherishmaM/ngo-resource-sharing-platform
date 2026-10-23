const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

// ✅ Function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// ✅ REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ❌ Remove userId checks (because it's not in the User model)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Save user without `userId`
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      id: user._id,  // ✅ Use `_id` instead of `userId`
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🟢 Login Attempt - Email:", email);

    // ✅ Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log("🔴 User not found in database");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("🟢 User Found:", user.email);
    console.log("🟢 Stored Hashed Password:", user.password);
    console.log("🟢 Entered Password:", password);


        // ✅ Check if the stored password looks like a bcrypt hash
        console.log("🟢 Checking if password was double hashed:", user.password.startsWith("$2a$10$"));


    // ✅ Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🟢 Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("🔴 Password mismatch");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ Login successful for:", user.email);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      ngo:user.ngo,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("🔴 Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET USER PROFILE (By ID)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // ✅ Use `req.user.id` instead of `userId`

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,  // ✅ Use `_id` instead of `userId`
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select("-password") .populate('ngo', 'name');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate('ngo');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, country, phone, profilePic } = req.body;
    const userId = req.user.id;

    // Find and update the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields provided
    if (name) user.name = name;
    if (country) user.country = country;
    if (phone) user.phone = phone;
    if (profilePic) user.profilePic = profilePic;

    await user.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      country: user.country,
      phone: user.phone,
      profilePic: user.profilePic,
      ngo: user.ngo,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Validate new password (optional: add more rules)
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("ngo", "name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { registerUser, loginUser, getUserProfile, getAllUsers, getCurrentUser, updateUserProfile, changePassword, getUserById };
