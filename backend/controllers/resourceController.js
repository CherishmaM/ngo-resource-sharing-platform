const Resource = require('../models/Resource');
const User = require('../models/User');
const Message = require('../models/Message');


const requestResource = async (req, res) => {
  try {
    const { resourceId } = req.body; // Resource ID from frontend
    const senderId = req.user.id; // Logged-in user (requester)

     // Check if the user has an NGO
     const user = await User.findById(senderId);
     if (!user.ngo) {
       return res.status(403).json({ message: "You must register an NGO to request resources" });
     }

    // Find the resource
    const resource = await Resource.findById(resourceId).populate("ngo", "name");
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Find the user linked to the NGO
    const ngoOwner = await User.findOne({ ngo: resource.ngo._id });
    if (!ngoOwner) {
      return res.status(404).json({ message: "NGO owner not found" });
    }

    // Prevent self-request
    if (ngoOwner._id.toString() === senderId) {
      return res.status(400).json({ message: "You cannot request your own resource" });
    }

    // Create a message
    const message = new Message({
      sender: senderId,
      receiver: ngoOwner._id,
      content: `Hello, I hope you're doing well. I am reaching out to inquire about the availability of ${resource.name}.Could you kindly confirm its availability at your earliest convenience? Thank you for your time and assistance.`,
    });
    await message.save();

    res.status(200).json({
       message: "Resource request sent successfully",
      receiverId: ngoOwner._id,
      });
  } catch (error) {
    console.error("Error requesting resource:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all resources
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('ngo', 'name email phone address');
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

// Get resources by NGO ID
const getResourcesByNgoId = async (req, res) => {
  try {
    const resources = await Resource.find({ ngo: req.params.ngoId }).populate('ngo');
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

//Get My Resources
const getMyResources = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("🟢 Fetching resources for logged-in user:", userId);

    // ✅ Find the logged-in user's NGO
    const user = await User.findById(userId);
    if (!user) {
      console.log("🔴 User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.ngo) {
      console.log("🔴 User has no linked NGO");
      return res.status(403).json({ error: "You must be linked to an NGO to view resources." });
    }

    // ✅ Fetch resources linked to this NGO
    const resources = await Resource.find({ ngo: user.ngo });
    console.log("✅ Resources fetched:", resources.length);
    res.status(200).json(resources);
  } catch (error) {
    console.error("🔴 Error fetching resources:", error);
    res.status(500).json({ error: "Failed to fetch resources" });
  }
};


// Create a new resource
const createResource = async (req, res) => {
  try {
    const { name, category, quantity, description } = req.body;
    const userId = req.user.id;

    console.log("🟢 Resource Addition Attempt - User ID:", userId);

    // ✅ Find the logged-in user
    const user = await User.findById(userId);
    console.log("🟢 User Found:", user.email, "| NGO Linked:", user.ngo);

    // ❌ If user doesn't have an NGO, block resource creation
    if (!user.ngo) {
      console.log("🔴 User is not registered with an NGO");
      return res.status(403).json({ error: "You must register an NGO before adding resources." });
    }

    // ✅ Create the resource linked to the user's NGO
    const newResource = new Resource({
      name,
      category,
      quantity,
      description,
      ngo: user.ngo, // ✅ Link to the NGO
    });

    const savedResource = await newResource.save();
    console.log("✅ Resource Added Successfully:", savedResource);
    res.status(201).json(savedResource);
  } catch (error) {
    console.error("🔴 Error creating resource:", error);
    res.status(500).json({ error: "Failed to create resource" });
  }
};

//Delete a Resource 
const deleteResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const resourceId = req.params.id;

    console.log("🟢 Delete Attempt - User ID:", userId, "| Resource ID:", resourceId);

    // ✅ Find the logged-in user and their NGO
    const user = await User.findById(userId);
    if (!user) {
      console.log("🔴 User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Find the resource and check ownership
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      console.log("🔴 Resource not found");
      return res.status(404).json({ error: "Resource not found" });
    }

    if (resource.ngo.toString() !== user.ngo.toString()) {
      console.log("🔴 Unauthorized delete attempt");
      return res.status(403).json({ error: "You can only delete resources added by your NGO" });
    }

    // ✅ Delete the resource
    await Resource.findByIdAndDelete(resourceId);
    console.log("✅ Resource Deleted");
    res.status(200).json({ message: "Resource deleted successfully" });

  } catch (error) {
    console.error("🔴 Error deleting resource:", error);
    res.status(500).json({ error: "Failed to delete resource" });
  }
};

const updateResource = async (req, res) => {
  try {
    const userId = req.user.id;
    const resourceId = req.params.id;
    const { name, category, quantity, description } = req.body;

    console.log("🟢 Update Attempt - User ID:", userId, "| Resource ID:", resourceId);

    // ✅ Find the logged-in user and their NGO
    const user = await User.findById(userId);
    if (!user) {
      console.log("🔴 User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Find the resource and check ownership
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      console.log("🔴 Resource not found");
      return res.status(404).json({ error: "Resource not found" });
    }

    if (resource.ngo.toString() !== user.ngo.toString()) {
      console.log("🔴 Unauthorized update attempt");
      return res.status(403).json({ error: "You can only update resources added by your NGO" });
    }

    // ✅ Update resource details
    resource.name = name || resource.name;
    resource.category = category || resource.category;
    resource.quantity = quantity || resource.quantity;
    resource.description = description || resource.description;

    const updatedResource = await resource.save();
    console.log("✅ Resource Updated Successfully:", updatedResource);
    res.status(200).json(updatedResource);

  } catch (error) {
    console.error("🔴 Error updating resource:", error);
    res.status(500).json({ error: "Failed to update resource" });
  }
};



module.exports = {
  getAllResources,
  getResourcesByNgoId,
  createResource,
  getMyResources,
  deleteResource, updateResource, requestResource
};