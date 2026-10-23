import React, { useEffect, useState } from "react";
import NGOCard from "../components/NGOCard";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const NGOList = () => {
  const [ngos, setNgos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ngos");
        if (!response.ok) {
          throw new Error("Failed to fetch NGOs");
        }
        const data = await response.json();
        setNgos(data);
      } catch (error) {
        console.error("Error fetching NGOs:", error);
        setError("Failed to fetch NGOs");
        toast.error("Failed to fetch NGOs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNgos();
  }, []);

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
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
        className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
      >
        Registered NGOs
      </motion.h1>

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
        ) : ngos.length === 0 && !error ? (
          <p className="text-gray-500 text-center w-full col-span-3 text-lg">
            No NGOs found.
          </p>
        ) : (
          ngos.map((ngo) => <NGOCard key={ngo._id} ngo={ngo} />) // Removed motion.div
        )}
      </motion.div>
    </div>
  );
};

export default NGOList;