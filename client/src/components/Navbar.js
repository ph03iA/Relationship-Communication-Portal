import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaBars, FaTimes, FaUser, FaSignOutAlt, FaComments } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/grievances', label: 'Grievances', icon: '💔' },
    { path: '/submit', label: 'Submit', icon: '📝' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  const authenticatedNavItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/grievances', label: 'Grievances', icon: '💔' },
    { path: '/partner', label: 'Partner Chat', icon: '💕' },
    { path: '/submit', label: 'Submit', icon: '📝' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ];

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const currentNavItems = isAuthenticated ? authenticatedNavItems : navItems;

  return (
    <nav className="navbar">
      <div className="container">
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="brand-link">
            <FaHeart className="brand-icon heartbeat" />
            <span className="brand-text">Relationship Communication Portal</span>
          </Link>
        </motion.div>

        <div className="navbar-menu">
          <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
            {currentNavItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="navbar-auth">
            {isAuthenticated ? (
              <motion.button
                className="btn btn-secondary"
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt />
                Logout
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/login" className="btn btn-primary">
                  <FaUser />
                  Login
                </Link>
              </motion.div>
            )}
          </div>

          <div className="navbar-toggle" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 