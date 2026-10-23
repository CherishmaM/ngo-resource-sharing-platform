import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion for animations

const MyResources = () => {
  const [resources, setResources] = useState([]);
  const [sortedResources, setSortedResources] = useState([]); // State for sorted resources
  const [error, setError] = useState("");
  const [editingResource, setEditingResource] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [sortOrder, setSortOrder] = useState("asc"); // Default sort order: ascending

  useEffect(() => {
    const fetchMyResources = async () => {
      const token = localStorage.getItem("userToken");

      if (!token) {
        setError("You must be logged in to view your resources.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/resources/my-resources", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setResources(data);
          setSortedResources(data); // Initialize sortedResources with fetched data
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch resources.");
        }
      } catch (error) {
        setError("Error fetching resources.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyResources();
  }, []);

  const deleteResource = async (resourceId) => {
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(`http://localhost:5000/api/resources/${resourceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setResources(resources.filter((resource) => resource._id !== resourceId));
        setSortedResources(sortedResources.filter((resource) => resource._id !== resourceId));
        toast.success("Resource deleted successfully.");
      } else {
        toast.error("Failed to delete resource.");
      }
    } catch (error) {
      toast.error("Error deleting resource.");
    }
  };

  const handleEditClick = (resource) => {
    setEditingResource(resource);
  };

  const updateResource = async () => {
    const token = localStorage.getItem("userToken");

    try {
      const response = await fetch(`http://localhost:5000/api/resources/${editingResource._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingResource),
      });

      if (response.ok) {
        const updatedResource = await response.json();
        setResources(
          resources.map((resource) =>
            resource._id === updatedResource._id ? updatedResource : resource
          )
        );
        setSortedResources(
          sortedResources.map((resource) =>
            resource._id === updatedResource._id ? updatedResource : resource
          )
        );
        setEditingResource(null);
        toast.success("Resource updated successfully.");
      } else {
        toast.error("Failed to update resource.");
      }
    } catch (error) {
      toast.error("Error updating resource.");
    }
  };

  // Function to sort resources by name
  const sortResources = (order) => {
    const sorted = [...resources].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (order === "asc") {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
    setSortedResources(sorted);
    setSortOrder(order);
  };

  // Skeleton card for loading state
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
      <div className="flex gap-4">
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-200 p-6 md:p-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
      >
        My Resources
      </motion.h1>

      {/* Sorting Controls */}
      <div className="flex gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sortResources("asc")}
          className={`px-4 py-2 rounded-lg shadow-md transition-all ${
            sortOrder === "asc"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Sort A-Z
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sortResources("desc")}
          className={`px-4 py-2 rounded-lg shadow-md transition-all ${
            sortOrder === "desc"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Sort Z-A
        </motion.button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-red-600 font-medium bg-red-100 px-4 py-2 rounded-lg mb-6 shadow"
        >
          {error}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl"
      >
        {loading ? (
          Array(3)
            .fill()
            .map((_, index) => <SkeletonCard key={index} />)
        ) : sortedResources.length === 0 && !error ? (
          <p className="text-gray-500 text-center w-full col-span-3 text-lg">
            No resources found.
          </p>
        ) : (
          sortedResources.map((resource) => (
            <motion.div
              key={resource._id}
              whileHover={{ scale: 1.03, boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-start bg-gradient-to-br from-blue-50 to-blue-100"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{resource.name}</h3>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Category:</span> {resource.category}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-semibold">Quantity:</span> {resource.quantity}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                <span className="font-semibold">Description:</span> {resource.description}
              </p>
              <div className="flex gap-4 mt-auto">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#DC2626" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => deleteResource(resource._id)}
                  className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all"
                >
                  Delete
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#D97706" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => handleEditClick(resource)}
                  className="bg-yellow-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition-all"
                >
                  Edit
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingResource && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={() => setEditingResource(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full mx-4 md:mx-0"
              initial={{ scale: 0.85, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: -20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h3 className="text-2xl font-semibold text-gray-800">Edit Resource</h3>
                <button
                  onClick={() => setEditingResource(null)}
                  className="text-gray-500 hover:text-gray-800 transition-transform transform hover:scale-110"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={editingResource.name}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Category</label>
                  <input
                    type="text"
                    value={editingResource.category}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, category: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={editingResource.quantity}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, quantity: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Description</label>
                  <textarea
                    value={editingResource.description}
                    onChange={(e) =>
                      setEditingResource({ ...editingResource, description: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#15803D" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={updateResource}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                >
                  Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#4B5563" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setEditingResource(null)}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyResources;