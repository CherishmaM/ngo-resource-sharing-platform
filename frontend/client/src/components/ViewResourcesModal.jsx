import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const ViewResourcesModal = ({ isOpen, onClose, ngoId }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setLoading(true);
      setResources([]);
      return;
    }

    const fetchResources = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/resources/ngo/${ngoId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast.error("Failed to fetch resources. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [isOpen, ngoId]);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }} // Faster overlay fade-in
          onClick={onClose}
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
              <h2 className="text-2xl font-semibold text-gray-800">Resources by NGO</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 transition-transform transform hover:scale-110"
              >
                Close
              </button>
            </div>

            <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-600">Loading resources...</p>
              ) : resources.length > 0 ? (
                <ul className="space-y-4">
                  {resources.map((resource) => (
                    <li
                      key={resource._id}
                      className="bg-gray-50 p-4 rounded-lg flex items-center shadow-sm"
                    >
                      <div className="ml-3 text-gray-800">
                        <h3 className="font-medium text-lg">{resource.name}</h3>
                        <p className="text-sm text-gray-600">Category: {resource.category}</p>
                        <p className="text-sm text-gray-600">Quantity: {resource.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-600">No resources found for this NGO.</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewResourcesModal;