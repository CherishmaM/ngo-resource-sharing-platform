import React, { useState } from 'react';
import Modal from './Modal';

export default function ResourceCard({ resource }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition">
      <h3 className="text-2xl font-semibold">{resource.name}</h3>
      <p className="text-gray-500">Category: {resource.category}</p>
      <p className="text-gray-700">Quantity: {resource.quantity}</p>
      <p className="text-blue-700 mt-2">NGO: {resource.ngo.name}</p>

      <div className="flex justify-between mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Request Resource
        </button>
        <button
          className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          onClick={handleContactClick}
        >
          Contact NGO
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} ngo={resource.ngo} />
    </div>
  );
}