import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Grievances from './pages/Grievances';
import SubmitGrievance from './pages/SubmitGrievance';
import GrievanceDetail from './pages/GrievanceDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PartnerCommunication from './pages/PartnerCommunication';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/grievances" element={<Grievances />} />
          <Route path="/submit" element={<SubmitGrievance />} />
          <Route path="/grievance/:id" element={<GrievanceDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/partner" element={<PartnerCommunication />} />
        </Routes>
      </motion.main>
    </div>
  );
}

export default App; 