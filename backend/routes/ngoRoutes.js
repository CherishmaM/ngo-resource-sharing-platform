const express = require('express');
const router = express.Router();
const { registerNgo, getNgos, updateNgoProfile} = require('../controllers/ngoController');
const authMiddleware = require("../middleware/authMiddleware");


// Route to register a new NGO
router.post('/register', authMiddleware, registerNgo);

// Route to get all NGOs
router.get('/', getNgos);

router.put('/update', authMiddleware, updateNgoProfile);


module.exports = router;