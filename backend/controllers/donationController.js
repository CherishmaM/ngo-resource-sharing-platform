const Donation = require('../models/Donation');
const User = require("../models/User");

// Get all donations
const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate('ngo');
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

// Create a new donation
const createDonation = async (req, res) => {
  try {
    const { resourceName, category, quantity, description, ngo } = req.body;
    const userId = req.user.id; // Get logged-in user ID

    // Validate required fields
    if (!resourceName || !category || !quantity || !description || !ngo) {
      return res.status(400).json({ error: "All fields are required, including the selected NGO" });
    }

    // Find the user associated with the selected NGO
    const ngoOwner = await User.findOne({ ngo: ngo }); // Changed from "ngo._id" to "ngo"
    if (!ngoOwner) {
      return res.status(404).json({ error: "NGO owner not found" });
    }

    // Create the donation
    const newDonation = new Donation({
      resourceName,
      category,
      quantity,
      description,
      donor: userId, // The logged-in user is the donor
      ngo, // The selected NGO ID from the request body
    });

    const savedDonation = await newDonation.save();
    res.status(201).json({
      message: "Donation made successfully",
      donation: savedDonation,
      receiverId: ngoOwner._id, // Return the user ID of the NGO owner
    });
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ error: "Failed to create donation" });
  }
};

module.exports = {
  getAllDonations,
  createDonation,
};