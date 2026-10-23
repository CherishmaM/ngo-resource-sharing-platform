const Ngo = require('../models/Ngo');
const User = require("../models/User");

// Get all NGOs
const getNgos = async (req, res) => {
    try {
      const ngos = await Ngo.find();
      res.status(200).json(ngos);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      res.status(500).json({ error: 'Failed to fetch NGOs' });
    }
  };

// Register a new NGO
const registerNgo = async (req, res) => {
  try {
    const { name, licenseNumber, email, phone, address, postal } = req.body;
    const userId = req.user.id; // ✅ Get logged-in user ID

    // ✅ Check if user already has an NGO
    const existingUser = await User.findById(userId);
    if (existingUser.ngo) {
      return res.status(400).json({ error: "You have already registered an NGO." });
    }

    // ✅ Check if NGO with this email already exists
    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) {
      return res.status(400).json({ error: "NGO with this email is already registered." });
    }

    // ✅ Create and save new NGO
    const newNgo = new Ngo({
      name,
      licenseNumber,
      email,
      description,
      phone,
      address,
      postal,
      country
    });

    const savedNgo = await newNgo.save();

    // ✅ Link NGO to the logged-in user
    existingUser.ngo = savedNgo._id;
    existingUser.role = "NGO Representative"; // ✅ Change role to NGO Representative
    await existingUser.save();

    res.status(201).json(savedNgo);
  } catch (error) {
    console.error("Error registering NGO:", error);
    res.status(500).json({ error: "Failed to register NGO" });
  }
};

const updateNgoProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('ngo');
    if (!user || !user.ngo) {
      return res.status(404).json({ message: "NGO not found for this user" });
    }

    const ngoId = user.ngo._id;
    const ngo = await Ngo.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    // Update only provided fields
    const { name, email, phone, address, postal, profilePic, country, description } = req.body;
    if (name) ngo.name = name;
    if (email) ngo.email = email;
    if (description) ngo.description = description;
    if (country) ngo.country = country;
    if (phone) ngo.phone = phone;
    if (address) ngo.address = address;
    if (postal) ngo.postal = postal;
    if (profilePic) ngo.profilePic = profilePic; // Assuming you handle file upload separately

    await ngo.save();
    res.status(200).json(ngo);
  } catch (error) {
    console.error("Error updating NGO profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerNgo,
  getNgos, updateNgoProfile
};