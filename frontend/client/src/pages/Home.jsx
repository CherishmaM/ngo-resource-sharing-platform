import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const controls = useAnimation();

  // State for hero carousel
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const heroImages = [
    { id: 1, src: "N1.jpg" }, // Replace with your image URLs
    { id: 2, src: "N2.jpg" },
    { id: 3, src: "N3.webp" },
  ];

  // State for What Can You Do carousel
  const [currentFeature, setCurrentFeature] = useState(0);

  // State for How It Works carousel
  const [currentStep, setCurrentStep] = useState(0);

  // State for checking if user has an NGO
  const [hasNgo, setHasNgo] = useState(null); // null = loading, true = has NGO, false = no NGO

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("userToken");

  // Fetch user data to check if NGO is registered
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (token) {
          const response = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          setHasNgo(!!data.ngo); // true if ngo exists, false if null
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setHasNgo(false); // Default to false on error
      }
    };
    if (isLoggedIn) fetchUser();
  }, [isLoggedIn]);

  // Automatic hero carousel
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds
    return () => clearInterval(heroInterval);
  }, [heroImages.length]);

  // Automatic What Can You Do carousel
  useEffect(() => {
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000); // Change feature every 4 seconds
    return () => clearInterval(featureInterval);
  }, []);

  // Automatic How It Works carousel
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % Math.ceil(steps.length / 3));
    }, 4000); // Change step every 4 seconds
    return () => clearInterval(stepInterval);
  }, []);

  // Navigation Handlers
  const handleMainButton = () => {
    if (!isLoggedIn) {
      navigate("/login"); // Not logged in -> redirect to login
    } else if (hasNgo === false) {
      navigate("/register"); // Logged in but no NGO -> redirect to register
    } else if (hasNgo === true) {
      navigate("/resources"); // Logged in and has NGO -> redirect to resources
    }
  };

  const handleChatWithNGOs = () => {
    navigate("/chat"); // Redirect to Chat with NGOs route
  };

  // Scroll animation for focus areas section
  useEffect(() => {
    const handleScroll = () => {
      const focusSection = document.getElementById("focus-areas-section");
      if (focusSection) {
        const { top } = focusSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (top < windowHeight * 0.8) {
          controls.start({ opacity: 1, y: 0 });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

  // Determine button text based on user status
  const mainButtonText = !isLoggedIn
    ? "Get Started"
    : hasNgo === null
    ? "Loading..."
    : hasNgo
    ? "View Resources"
    : "Register as NGO";

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[700px] flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <svg
            className="w-full h-full opacity-20"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#DBEAFE"
              fillOpacity="1"
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="relative flex flex-col md:flex-row items-center max-w-7xl mx-auto z-10">
          <motion.div
            className="text-center md:text-left w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Empowering NGOs, One Resource at a Time
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Donate, Request, and Manage Resources Seamlessly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.button
                onClick={handleMainButton}
                whileHover={{ scale: 1.05, backgroundColor: "#1D4ED8" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg text-lg font-semibold transition-all"
                disabled={hasNgo === null}
              >
                {mainButtonText}
              </motion.button>
              {hasNgo && (
                <motion.button
                  onClick={handleChatWithNGOs}
                  whileHover={{ scale: 1.05, backgroundColor: "#1D4ED8" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg text-lg font-semibold transition-all"
                >
                  Chat with NGOs
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Hero Image Carousel */}
          <motion.div
            className="flex-shrink-0 mt-8 md:mt-0 md:ml-8 w-full md:w-1/2 relative h-[600px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {heroImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="absolute inset-0 rounded-xl shadow-lg overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentHeroImage ? 1 : 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <img
                  src={image.src}
                  alt={`Hero Image ${image.id}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Focus Areas Section */}
      <div
        id="focus-areas-section"
        className="py-16 bg-gradient-to-br from-blue-50 to-blue-100"
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Our Focus Areas
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {focusAreas.map((area, index) => (
            <motion.div
              key={index}
              className="relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-gray-100 overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 ${area.color} rounded-full flex items-center justify-center mb-4`}>
                  {area.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">
                  {area.name}
                </h3>
                <p className="text-sm text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2 text-center">
                  {area.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* What Can You Do? Section (Automatic Carousel) */}
      <div className="py-24 px-6 bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          What Can You Do?
        </motion.h2>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="relative flex flex-col items-center">
            {/* Carousel */}
            <div className="relative w-full max-w-md overflow-hidden">
              <motion.div
                className="flex"
                animate={{ x: `-${currentFeature * 100}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="min-w-full p- Duplex bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center text-center"
                    style={{
                      height: "400px",
                      opacity: index === currentFeature ? 1 : 0.5,
                    }}
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                    {feature.title === "Register NGOs" ? (
                      <motion.button
                        onClick={() => navigate("/register")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600 mt-6 inline-block font-semibold hover:underline"
                      >
                        Register Now →
                      </motion.button>
                    ) : feature.title === "Donate Resources" ? (
                      <motion.a
                        href={feature.link}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600 mt-6 inline-block font-semibold hover:underline"
                      >
                        Donate Now →
                      </motion.a>
                    ) : feature.title === "Request Resources" ? (
                      <motion.a
                        href={feature.link}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-600 mt-6 inline-block font-semibold hover:underline"
                      >
                        View Resources →
                      </motion.a>
                    ) : null}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-3 mt-6">
              {features.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentFeature(index)}
                  className={`w-4 h-4 rounded-full ${
                    currentFeature === index ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                ></motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section (Automatic Full Horizontal Carousel) */}
      <div className="py-24 bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>
        <div className="relative max-w-7xl mx-auto px-6 overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${currentStep * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {[...Array(Math.ceil(steps.length / 3))].map((_, groupIndex) => (
              <div
                key={groupIndex}
                className="min-w-full flex flex-col md:flex-row gap-8 justify-between"
              >
                {steps
                  .slice(groupIndex * 3, (groupIndex + 1) * 3)
                  .map((step, index) => (
                    <div
                      key={index}
                      className="flex-1 p-8 bg-gradient-to-br from-blue-200 to-blue-400 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
                    >
                      <h4 className="text-2xl font-semibold text-white mb-4">
                        {step.title}
                      </h4>
                      <p className="text-lg text-white">{step.description}</p>
                    </div>
                  ))}
              </div>
            ))}
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex gap-3 mt-6 justify-center">
            {[...Array(Math.ceil(steps.length / 3))].map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-4 h-4 rounded-full ${
                  currentStep === index ? "bg-blue-600" : "bg-gray-300"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              ></motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-24 bg-white">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-800 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Locations of NGOs
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-6">
          {maps.map((map, index) => (
            <motion.div
              key={index}
              className="border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100">
                <h4 className="text-lg font-semibold text-gray-800">{map.name}</h4>
                <p className="text-sm text-gray-600">{map.location}</p>
              </div>
              <iframe
                src={map.src}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

const features = [
  {
    title: "Register NGOs",
    description: "Easily register and manage NGOs on the platform.",
    icon: (
      <svg
        className="w-8 h-8 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        ></path>
      </svg>
    ),
    link: "/register",
  },
  {
    title: "Donate Resources",
    description: "Support communities by donating resources.",
    icon: (
      <svg
        className="w-8 h-8 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    ),
    link: "/donate",
  },
  {
    title: "Request Resources",
    description: "Request essential resources for NGOs.",
    icon: (
      <svg
        className="w-8 h-8 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        ></path>
      </svg>
    ),
    link: "/resources",
  },
];

const focusAreas = [
  {
    name: "Education",
    description: "Empowering communities through access to quality education.",
    icon: (
      <svg
      className="w-6 h-6 text-blue-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 19.5V6a2 2 0 012-2h10a2 2 0 012 2v13.5M4 19.5a2 2 0 002 2h10a2 2 0 002-2M4 19.5h14M8 6v15"
      />
    </svg>
    

    ),
    color: "bg-blue-200",
  },
  {
    name: "Health",
    description: "Providing essential healthcare resources to those in need.",
    icon: (
<svg
  className="w-6 h-6 text-blue-500"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M15.232 5.232a4.5 4.5 0 016.364 6.364L11.596 21.596a4.5 4.5 0 01-6.364-6.364l9.636-9.636z"
  />
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M8.586 16.414L12 20m0-4l3.414 3.414"
  />
</svg>



    ),
    color: "bg-green-200",
  },
  {
    name: "Clothing",
    description: "Distributing clothing to support vulnerable populations.",
    icon: (
      <svg
      className="w-6 h-6 text-blue-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 4a4 4 0 014-4h8a4 4 0 014 4v3h-2a2 2 0 00-2 2v11h-8V9a2 2 0 00-2-2H4V4z"
      />
    </svg>
    
    ),
    color: "bg-purple-200",
  },
  {
    name: "Agriculture",
    description: "Supporting sustainable farming and food security.",
    icon: (
      <svg
  className="w-6 h-6 text-green-500"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="M12 22V13m0 0c-1.657 0-3-1.343-3-3 0-2.5 3-5 3-5s3 2.5 3 5c0 1.657-1.343 3-3 3zm-6-3a6 6 0 0112 0M5 21h14"
  />
</svg>

    ),
    color: "bg-yellow-200",
  },
];

const steps = [
  { title: "Sign Up", description: "Create your account to get started." },
  { title: "Register NGO", description: "Submit your NGO details for approval." },
  { title: "Donate or Request", description: "Start exchanging resources seamlessly." },
];

const maps = [
  {
    name: "Amma Devi Foundation",
    location: "Hyderabad, India",
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.913091127149!2d78.51545877351977!3d17.36791450336907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf676aaf5e3eb13b%3A0x99eef2b17881953d!2sAmma%20Devi%20Foundation!5e0!3m2!1sen!2sin!4v1738049985312!5m2!1sen!2sin",
  },
  {
    name: "Global Forum for Development",
    location: "Gulu, Uganda",
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d544.4735463976631!2d32.89441754857921!3d2.257831398958841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1770ba6d48297fcb%3A0x513f63c33c33d60d!2sGlobal%20Forum%20for%20Development%20-%20GLOFORD!5e0!3m2!1sen!2sin!4v1738050392367!5m2!1sen!2sin",
  },
  {
    name: "Hope Development Initiative",
    location: "Kampala, Uganda",
    src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5882068.506455552!2d28.978206519696908!3d-0.6725484474010653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbd08e16e0ec3%3A0x49b85db4c5d47da9!2sHope%20Development%20Initiative%20-%20HDI!5e0!3m2!1sen!2sin!4v1738050488324!5m2!1sen!2sin",
  },
];