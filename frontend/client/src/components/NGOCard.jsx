import React, { useState } from "react";
import { motion } from "framer-motion";
import Modal from "./Modal";
import ViewResourcesModal from "./ViewResourcesModal";

const NGOCard = ({ ngo }) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true); // Simply open the contact modal
  };

  const handleViewResourcesClick = () => {
    setIsResourcesModalOpen(true); // Simply open the resources modal
  };

  // Disable hover animation when any modal is open
  const isAnyModalOpen = isContactModalOpen || isResourcesModalOpen;

  return (
    <motion.div
      whileHover={
        !isAnyModalOpen
          ? { scale: 1.03, boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)" }
          : {}
      }
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col items-start bg-gradient-to-br from-blue-50 to-blue-100"
    >
      {/* NGO Name */}
      <motion.h3
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-2xl font-bold text-gray-800 mb-2"
      >
        {ngo.name}
      </motion.h3>

      {/* NGO Description */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-gray-600 text-sm mb-4"
      >
        {ngo.description || "No description available."}
      </motion.p>

      {/* Buttons */}
      <div className="flex gap-4 mt-auto">
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#1D4ED8" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          onClick={handleContactClick}
        >
          Contact NGO
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "#1D4ED8" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
          onClick={handleViewResourcesClick}
        >
          View Resources
        </motion.button>
      </div>

      {/* Contact Modal */}
      <Modal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} ngo={ngo} />

      {/* View Resources Modal */}
      <ViewResourcesModal
        isOpen={isResourcesModalOpen}
        onClose={() => setIsResourcesModalOpen(false)}
        ngoId={ngo._id}
      />
    </motion.div>
  );
};

export default NGOCard;