import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart, FaSearch, FaFilter, FaEye, FaThumbsUp, FaComment } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import './Grievances.css';

const Grievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    severity: '',
    status: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

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
  const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];

  const fetchGrievances = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/grievances?${params}`);
      if (response.ok) {
        const data = await response.json();
        setGrievances(data.grievances || []);
      }
    } catch (error) {
      console.error('Error fetching grievances:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGrievances();
  }, [fetchGrievances]);

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
      'Open': '#007bff',
      'In Progress': '#ffc107',
      'Resolved': '#28a745',
      'Closed': '#6c757d'
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return (
      <div className="grievances-loading">
        <div className="spinner"></div>
        <p>Loading grievances...</p>
      </div>
    );
  }

  return (
    <div className="grievances">
      <div className="container">
        <motion.div
          className="grievances-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Browse Grievances 💔</h1>
          <p>Find support and advice from others who understand</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="grievances-controls"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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

          <button
            className="btn btn-secondary filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filters
          </button>
        </motion.div>

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            className="filter-options"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filter-grid">
              <div className="filter-group">
                <label>Category</label>
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
                <label>Severity</label>
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Severities</option>
                  {severityLevels.map(severity => (
                    <option key={severity} value={severity}>{severity}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Status</label>
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
            </div>
          </motion.div>
        )}

        {/* Grievances Grid */}
        <motion.div
          className="grievances-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {grievances.length === 0 ? (
            <div className="no-grievances">
              <FaHeart className="no-grievances-icon" />
              <h3>No grievances found</h3>
              <p>Try adjusting your filters or be the first to submit a grievance!</p>
              <Link to="/submit" className="btn btn-primary">
                Submit a Grievance
              </Link>
            </div>
          ) : (
            grievances.map((grievance, index) => (
              <motion.div
                key={grievance._id}
                className="grievance-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="grievance-header">
                  <div className="grievance-meta">
                    <span className="grievance-category">{grievance.category}</span>
                    <span 
                      className="grievance-severity"
                      style={{ backgroundColor: getSeverityColor(grievance.severity) }}
                    >
                      {grievance.severity}
                    </span>
                    <span 
                      className="grievance-status"
                      style={{ backgroundColor: getStatusColor(grievance.status) }}
                    >
                      {grievance.status}
                    </span>
                  </div>
                  <div className="grievance-date">
                    {formatDistanceToNow(new Date(grievance.createdAt), { addSuffix: true })}
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

                <div className="grievance-details">
                  <span className="boyfriend-name">💔 {grievance.boyfriendName}</span>
                  <span className="relationship-duration">⏰ {grievance.relationshipDuration}</span>
                </div>

                {grievance.tags && grievance.tags.length > 0 && (
                  <div className="grievance-tags">
                    {grievance.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag">
                        #{tag}
                      </span>
                    ))}
                    {grievance.tags.length > 3 && (
                      <span className="tag-more">+{grievance.tags.length - 3} more</span>
                    )}
                  </div>
                )}

                <div className="grievance-footer">
                  <div className="grievance-stats">
                    <span className="stat">
                      <FaThumbsUp />
                      {grievance.likes?.length || 0}
                    </span>
                    <span className="stat">
                      <FaComment />
                      {grievance.comments?.length || 0}
                    </span>
                  </div>
                  <Link to={`/grievance/${grievance._id}`} className="btn btn-secondary btn-small">
                    <FaEye />
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Grievances; 