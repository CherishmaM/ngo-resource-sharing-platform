import {Toaster} from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Resources from "./pages/Resources";
import ProtectedRoute from './components/ProtectedRoute';
import AddResource from "./pages/AddResource";
import NGOList from "./pages/NGOList";
import AboutUs from "./pages/AboutUs";
import ProfilePage from "./pages/Profile";
import NGOProfile from "./pages/NGOprofile";
import MyResources from "./pages/MyResources";
import ChatPage from "./pages/ChatPage";

function App() {

  return (
    <Router>
      <Navbar />
      <div>
      <Toaster
          position="top-center" // Position of the toast
          toastOptions={{
            duration: 3000, // Auto-close after 3 seconds
            style: {
              borderRadius: "8px",
              fontFamily: "Roboto, sans-serif",
              fontSize: "14px",
              padding: "12px 16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            success: {
              style: {
                background: "#4caf50", // Green for success
                color: "white",
              },
            },
            error: {
              style: {
                background: "#f44336", // Red for error
                color: "white",
              },
            },
            info: {
              style: {
                background: "#2196f3", // Blue for info
                color: "white",
              },
            },
            warning: {
              style: {
                background: "#ff9800", // Orange for warning
                color: "white",
              },
            },
          }}
        />
        
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/add-resource" element={<AddResource />} />
        <Route path="/ngo-list" element={ <NGOList/>} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ngoprofile" element={<NGOProfile />} />
        <Route path="/my-resources" element={<MyResources />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/register" element={
            <ProtectedRoute>
                <Register />
            </ProtectedRoute>
        } />

      </Routes>
      </div>
    </Router>
  );
}

export default App;
