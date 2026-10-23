const express = require('express');
const router = express.Router();
const { getAllDonations, createDonation } = require('../controllers/donationController');
const authMiddleware = require("../middleware/authMiddleware");

// Route to get all donations
router.get('/', getAllDonations);

// Route to create a new donation
router.post('/', authMiddleware, createDonation);

module.exports = router;