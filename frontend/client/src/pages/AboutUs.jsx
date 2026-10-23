import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdGroups, MdRocketLaunch, MdVisibility } from "react-icons/md";

const AboutUs = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Who We Are",
      content:
        "We are a passionate team dedicated to empowering NGOs by providing a digital platform that fosters collaboration, resource sharing, and impactful partnerships. Our mission is built on the principles of trust, transparency, and collective progress, ensuring that every organization, regardless of size or location, has the opportunity to thrive. By bridging gaps between NGOs and facilitating seamless communication, we strive to create a global ecosystem where social initiatives are strengthened, and meaningful change is accelerated.",
      icon: (
        <MdGroups className="inline-block mr-3 text-blue-700 text-5xl p-2 bg-blue-100 rounded-full" />
      ),
      image: "/logo.png", // Updated to use the NGOCONNECT logo
    },
    {
      title: "Our Mission",
      content:
        "Our mission is to revolutionize the way NGOs operate by creating a unified platform that enables them to connect, collaborate, and share underutilized resources. We aim to reduce resource wastage, maximize impact, and foster efficiency by linking local and international NGOs. By simplifying resource exchange and enhancing strategic cooperation, we empower organizations to focus on what truly matters—driving social change and making a lasting difference in communities worldwide.",
      icon: (
        <MdRocketLaunch className="inline-block mr-3 text-blue-700 text-5xl p-2 bg-blue-100 rounded-full" />
      ),
      image: "/Mission.png", // Replace with appropriate image path
    },
    {
      title: "Our Vision",
      content:
        "We envision a world where every NGO, regardless of its geographical location or financial capacity, has access to the resources, support, and partnerships needed to fulfill its mission. Through our platform, we strive to create a sustainable ecosystem where NGOs can work together seamlessly, ensuring that every effort, donation, and resource is optimally utilized. Our vision is to promote long-term sustainability, social equity, and a future where humanitarian efforts lead to measurable, lasting transformations in society.",
      icon: (
        <MdVisibility className="inline-block mr-3 text-blue-700 text-5xl p-2 bg-blue-100 rounded-full" />
      ),
      image: "/Vision.png", // Replace with appropriate image path
    },
  ];

  // Automatic carousel effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const slideLeftToRight = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.8 } },
  };

  const hoverEffect = {
    whileHover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="text-gray-800 flex flex-col items-center"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeIn}
    >
      {/* Header Section */}
      <motion.header
        className="text-center py-6 px-6"
        variants={fadeIn}
        {...hoverEffect}
      >
        <h1 className="text-5xl text-blue-900 mb-3 font-bold">About Us</h1>
        <p className="text-2xl text-blue-800">
          Empowering NGOs to collaborate, optimize resources, and amplify their impact for sustainable change.
        </p>
      </motion.header>

      {/* Automatic Carousel Section */}
      <AnimatePresence mode="wait">
        <motion.section
          key={currentSlide}
          className="w-full h-[70vh] bg-lightblue-300 rounded-lg flex items-center justify-start p-8 my-2"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideLeftToRight}
        >
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between w-full"
            variants={slideLeftToRight}
          >
            {/* Text Content */}
            <motion.div className="max-w-3xl text-left md:ml-12">
              <h2 className="text-5xl font-semibold mb-6 flex items-center text-blue-700">
                {slides[currentSlide].icon} {slides[currentSlide].title}
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                {slides[currentSlide].content}
              </p>
            </motion.div>

            {/* Image */}
            <motion.img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full md:w-1/2 h-80 object-contain rounded-lg mt-6 md:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.8 } }}
              {...hoverEffect}
            />
          </motion.div>
        </motion.section>
      </AnimatePresence>
    </motion.div>
  );
};

export default AboutUs;