import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaUser, 
  FaEnvelope, 
  FaLink, 
  FaUnlink, 
  FaComments, 
  FaEye, 
  FaPlus,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import './PartnerCommunication.css';

const PartnerCommunication = () => {
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [linking, setLinking] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    status: '',
    search: ''
  });

  const categories = [
    'Communication',
    'Attention',
    'Jealousy',
    'Laziness',
    'Messiness',
    'Gaming',
    'Social Media',
    'Other'
  ];

  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
  const statusOptions = ['Pending Response', 'Responded', 'Resolved', 'Escalated'];

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to access partner communication');
      return;
    }
    fetchUserData();
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        if (userData.partner) {
          fetchPartnerData();
          fetchPartnerGrievances();
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  const fetchPartnerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/partner', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const partnerData = await response.json();
        setPartner(partnerData);
      }
    } catch (error) {
      console.error('Error fetching partner data:', error);
    }
  };

  const fetchPartnerGrievances = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/grievances/partner?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGrievances(data.grievances || []);
      }
    } catch (error) {
      console.error('Error fetching partner grievances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkPartner = async (e) => {
    e.preventDefault();
    if (!partnerEmail.trim()) {
      toast.error('Please enter partner email');
      return;
    }

    setLinking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/link-partner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ partnerEmail: partnerEmail.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg);
        setShowLinkForm(false);
        setPartnerEmail('');
        fetchUserData();
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error('Error linking partner:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkPartner = async () => {
    if (!window.confirm('Are you sure you want to unlink your partner?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/unlink-partner', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg);
        setPartner(null);
        setGrievances([]);
        fetchUserData();
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error('Error unlinking partner:', error);
      toast.error('Network error. Please try again.');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': '#28a745',
      'Medium': '#ffc107',
      'High': '#fd7e14',
      'Critical': '#dc3545'
    };
    return colors[severity] || '#666';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending Response': '#007bff',
      'Responded': '#28a745',
      'Resolved': '#6c757d',
      'Escalated': '#dc3545'
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return (
      <div className="partner-communication-loading">
        <div className="spinner"></div>
        <p>Loading partner communication...</p>
      </div>
    );
  }

  return (
    <div className="partner-communication">
      <div className="container">
        <motion.div
          className="partner-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Partner Communication 💕</h1>
          <p>Connect with your partner and work through relationship issues together</p>
        </motion.div>

        {!user ? (
          <motion.div
            className="auth-required"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaUser className="auth-icon" />
            <h3>Authentication Required</h3>
            <p>Please login to access partner communication features</p>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </motion.div>
        ) : !partner ? (
          <motion.div
            className="no-partner"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaLink className="no-partner-icon" />
            <h3>No Partner Linked</h3>
            <p>Link with your partner to start communicating about relationship issues</p>
            
            {!showLinkForm ? (
              <button 
                className="btn btn-primary"
                onClick={() => setShowLinkForm(true)}
              >
                <FaLink />
                Link Partner
              </button>
            ) : (
              <motion.form 
                className="link-partner-form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleLinkPartner}
              >
                <div className="form-group">
                  <label htmlFor="partnerEmail">Partner's Email</label>
                  <input
                    type="email"
                    id="partnerEmail"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    placeholder="Enter your partner's email"
                    required
                    className="input"
                  />
                </div>
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={linking}
                  >
                    {linking ? 'Linking...' : 'Link Partner'}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowLinkForm(false);
                      setPartnerEmail('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.form>
            )}
          </motion.div>
        ) : (
          <>
            {/* Partner Info */}
            <motion.div
              className="partner-info"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="partner-card">
                <div className="partner-avatar">
                  <FaUser />
                </div>
                <div className="partner-details">
                  <h3>{partner.username}</h3>
                  <p>{partner.email}</p>
                  <span className="relationship-status">
                    <FaHeart />
                    {partner.relationshipStatus}
                  </span>
                </div>
                <button 
                  className="btn btn-secondary btn-small"
                  onClick={handleUnlinkPartner}
                >
                  <FaUnlink />
                  Unlink
                </button>
              </div>
            </motion.div>

            {/* Filters */}
            <motion.div
              className="communication-controls"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="search-bar">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search grievances..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-group">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <Link to="/submit" className="btn btn-primary">
                <FaPlus />
                New Grievance
              </Link>
            </motion.div>

            {/* Grievances List */}
            <motion.div
              className="partner-grievances"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {grievances.length === 0 ? (
                <div className="no-grievances">
                  <FaComments className="no-grievances-icon" />
                  <h3>No grievances yet</h3>
                  <p>Start the conversation by submitting your first grievance!</p>
                  <Link to="/submit" className="btn btn-primary">
                    Submit First Grievance
                  </Link>
                </div>
              ) : (
                <div className="grievances-list">
                  {grievances.map((grievance, index) => (
                    <motion.div
                      key={grievance._id}
                      className="grievance-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="grievance-header">
                        <div className="grievance-author">
                          <FaUser />
                          {grievance.user.username}
                        </div>
                        <div className="grievance-meta">
                          <span 
                            className="grievance-severity"
                            style={{ backgroundColor: getSeverityColor(grievance.severity) }}
                          >
                            {grievance.severity}
                          </span>
                          <span 
                            className="grievance-status"
                            style={{ backgroundColor: getStatusColor(grievance.communicationStatus) }}
                          >
                            {grievance.communicationStatus}
                          </span>
                          <span className="grievance-date">
                            {formatDistanceToNow(new Date(grievance.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      <h3 className="grievance-title">
                        <Link to={`/grievance/${grievance._id}`}>
                          {grievance.title}
                        </Link>
                      </h3>

                      <p className="grievance-description">
                        {grievance.description.length > 150
                          ? `${grievance.description.substring(0, 150)}...`
                          : grievance.description
                        }
                      </p>

                      {grievance.partnerResponse && (
                        <div className="partner-response">
                          <div className="response-header">
                            <FaUser />
                            <span>Partner Response</span>
                            <span className="response-date">
                              {formatDistanceToNow(new Date(grievance.partnerResponse.date), { addSuffix: true })}
                            </span>
                          </div>
                          <p>{grievance.partnerResponse.text}</p>
                        </div>
                      )}

                      <div className="grievance-footer">
                        <div className="grievance-stats">
                          <span className="stat">
                            <FaComments />
                            {grievance.comments?.length || 0}
                          </span>
                        </div>
                        <Link to={`/grievance/${grievance._id}`} className="btn btn-secondary btn-small">
                          <FaEye />
                          View Details
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default PartnerCommunication; 