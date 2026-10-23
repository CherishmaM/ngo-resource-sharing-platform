import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiPhone, FiMapPin, FiX, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

const Modal = ({ isOpen, onClose, ngo }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  if (!ngo) {
    toast.error("NGO data is missing. Please try again.");
    onClose();
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }} // Faster overlay fade-in
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 md:mx-0 relative"
            initial={{ scale: 0.85, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FiUser className="text-blue-500 w-6 h-6" />
                {ngo.name}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 text-xl transition-all"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* NGO Details */}
            <div className="mt-4 space-y-4">
              <p className="flex items-center gap-2 text-gray-700">
                <FiMail className="text-blue-500 w-5 h-5" />
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${ngo.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {ngo.email || "N/A"}
                </a>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FiPhone className="text-green-500 w-5 h-5" />
                <strong>Phone:</strong>{" "}
                <a
                  href={`tel:${ngo.phone}`}
                  className="text-blue-500 hover:underline"
                >
                  {ngo.phone || "N/A"}
                </a>
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FiMapPin className="text-red-500 w-5 h-5" />
                <strong>Address:</strong> {ngo.address || "N/A"}
              </p>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
              >
                <FiX className="w-5 h-5" />
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;