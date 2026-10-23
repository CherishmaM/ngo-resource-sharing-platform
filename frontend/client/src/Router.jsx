import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import ProtectedRoute from './components/ProtectedRoute';


export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path ="/donate" element={<Donate />} />
        
        <Route path="/register" element={
            <ProtectedRoute>
                <Register />
            </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}
