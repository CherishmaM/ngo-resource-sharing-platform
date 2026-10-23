import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast"; // Import react-hot-toast

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsSignup(false), 300);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isSignup
        ? "http://localhost:5000/api/users/register"
        : "http://localhost:5000/api/users/login";
      const payload = isSignup
        ? { name: fullName, email, password, role: "Individual" }
        : { email, password };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data));
        console.log("🟢 Stored User Data in LocalStorage:", data);
        toast.success(isSignup ? "Signup successful! Welcome aboard!" : "Login successful! Welcome back!"); // Use react-hot-toast
        navigate("/");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Authentication failed"); // Use react-hot-toast
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("Something went wrong. Please try again."); // Use react-hot-toast
    }
  };

  const handleModeSwitch = () => {
    setIsSignup(!isSignup);
    toast(`Switched to ${isSignup ? "Login" : "Signup"} mode`, {
      style: { background: "#2196f3", color: "white" }, // Custom style for info
    }); // Use react-hot-toast
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 to-blue-300 relative">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-1/2 flex justify-center items-center px-12"
      >
        <div className="max-w-md w-full bg-white/50 backdrop-blur-lg shadow-xl p-8 rounded-2xl border border-white/50">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Welcome back</h1>
          <p className="text-blue-700 mb-6">Please enter your details</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="relative">
                <label className="block text-sm font-medium text-blue-800">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 text-blue-500" size={20} />
                  <motion.input
                    whileFocus={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(59,130,246,0.5)" }}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full p-3 pl-10 border border-blue-300 rounded-lg bg-white text-blue-900 placeholder-blue-500 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <label className="block text-sm font-medium text-blue-800">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 text-blue-500" size={20} />
                <motion.input
                  whileFocus={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(59,130,246,0.5)" }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-blue-300 rounded-lg bg-white text-blue-900 placeholder-blue-500 focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-blue-800">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 text-blue-500" size={20} />
                <motion.input
                  whileFocus={{ scale: 1.05, boxShadow: "0px 0px 8px rgba(59,130,246,0.5)" }}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-blue-300 rounded-lg bg-white text-blue-900 placeholder-blue-500 focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-blue-500 hover:text-blue-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              {isSignup ? "Sign Up" : "Sign In"}
            </motion.button>
          </form>
          <p className="mt-6 text-center text-sm text-blue-800">
            {isSignup ? "Already have an account?" : "Don't have an account?"} {" "}
            <span
              onClick={handleModeSwitch}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              {isSignup ? "Login here" : "Sign up"}
            </span>
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-1/2 flex justify-center items-center bg-blue-200"
      >
        <img
          src="./logo.png"
          alt="Illustration"
          className="w-3/4 max-w-lg transition-transform duration-300 ease-in-out hover:scale-110"
        />
      </motion.div>
    </div>
  );
}