import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaUsers, FaShieldAlt, FaComments, FaChartLine, FaUserFriends, FaHandshake } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: <FaHeart />,
      title: 'Express Your Feelings',
      description: 'Share your relationship concerns and feelings in a safe, supportive environment.'
    },
    {
      icon: <FaUserFriends />,
      title: 'Partner Communication',
      description: 'Connect with your partner and work through issues together through our platform.'
    },
    {
      icon: <FaUsers />,
      title: 'Community Support',
      description: 'Get advice and support from others who understand relationship challenges.'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Safe & Private',
      description: 'Your conversations are private and secure. Share with confidence.'
    },
    {
      icon: <FaHandshake />,
      title: 'Conflict Resolution',
      description: 'Work through disagreements and find solutions together with your partner.'
    },
    {
      icon: <FaChartLine />,
      title: 'Track Progress',
      description: 'Monitor your relationship growth and see improvement over time.'
    }
  ];

  const stats = [
    { number: '1,234', label: 'Issues Shared' },
    { number: '567', label: 'Happy Couples' },
    { number: '89', label: 'Issues Resolved' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Welcome to the <span className="highlight">Relationship Communication Portal</span> 💕
            </h1>
            <p className="hero-subtitle">
              A safe space for couples to express their feelings, communicate effectively, and work through relationship challenges together.
            </p>
            <div className="hero-actions">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/submit" className="btn btn-primary btn-large">
                  <FaHeart />
                  Share Your Feelings
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/partner" className="btn btn-secondary btn-large">
                  <FaUserFriends />
                  Partner Chat
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Why Choose Our Platform?</h2>
            <p>We provide a comprehensive solution for better relationship communication</p>
          </motion.div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>How It Works</h2>
            <p>Simple steps to better communication with your partner</p>
          </motion.div>
          
          <div className="steps-grid">
            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="step-number">1</div>
              <h3>Register & Link</h3>
              <p>Create an account and link with your partner using their email address.</p>
            </motion.div>
            
            <motion.div
              className="step-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="step-number">2</div>
              <h3>Share Feelings</h3>
              <p>Express your concerns, feelings, or issues you'd like to discuss with your partner.</p>
            </motion.div>
            
            <motion.div
              className="step-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="step-number">3</div>
              <h3>Communicate</h3>
              <p>Your partner can respond, and you can have a constructive conversation together.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Improve Your Relationship?</h2>
            <p>Join couples who have strengthened their bond through better communication.</p>
            <div className="cta-actions">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register" className="btn btn-primary btn-large">
                  Get Started Today
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/grievances" className="btn btn-secondary btn-large">
                  Browse Community
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home; 