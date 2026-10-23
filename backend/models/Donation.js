const mongoose = require('mongoose');
const donationSchema = new mongoose.Schema({
  resourceName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ngo',
    required: false,
  },
}, { timestamps: true });
module.exports = mongoose.model('Donation', donationSchema);