const express = require('express');
const router = express.Router();
const { getAllResources, getResourcesByNgoId, createResource, getMyResources, deleteResource, updateResource, requestResource } = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all resources
router.get('/', getAllResources);

// Route to get resources by NGO ID
router.get('/ngo/:ngoId', getResourcesByNgoId);

// Route to get resources for logged-in user
router.get('/my-resources', authMiddleware, getMyResources);

// Route to create a new resource
router.post('/', authMiddleware, createResource);

//Route to delete a resource
router.delete('/:id', authMiddleware, deleteResource);

// Route to update a resource
router.put('/:id', authMiddleware, updateResource);

router.post('/request', authMiddleware, requestResource);

module.exports = router;