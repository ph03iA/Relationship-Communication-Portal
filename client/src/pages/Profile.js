import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaHeart, 
  FaEdit, 
  FaCog, 
  FaSave, 
  FaTimes, 
  FaEnvelope, 
  FaCalendarAlt,
  FaFileAlt,
  FaThumbsUp,
  FaComments,
  FaEye
} from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userGrievances, setUserGrievances] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    relationshipStatus: '',
    avatar: ''
  });

  const relationshipStatuses = [
    'Single',
    'In a Relationship',
    'Married',
    'It\'s Complicated'
  ];

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to view your profile');
      navigate('/login');
      return;
    }
    fetchUserData();
    fetchUserGrievances();
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view your profile');
        navigate('/login');
        return;
      }

      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setFormData({
          username: data.username || '',
          email: data.email || '',
          bio: data.bio || '',
          relationshipStatus: data.relationshipStatus || 'Single',
          avatar: data.avatar || ''
        });
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Network error loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserGrievances = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/grievances', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserGrievances(data.grievances || []);
      } else {
        console.error('Failed to fetch user grievances');
      }
    } catch (error) {
      console.error('Error fetching user grievances:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to update your profile');
        navigate('/login');
        return;
      }

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setIsEditing(false);
        toast.success('Profile updated successfully! 💔');
      } else if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Network error updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      'Open': 'status-open',
      'In Progress': 'status-progress',
      'Resolved': 'status-resolved',
      'Closed': 'status-closed'
    };
    return statusClasses[status] || 'status-open';
  };

  if (isLoading) {
    return (
      <div className="profile">
        <div className="container">
          <div className="loading-placeholder">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile">
        <div className="container">
          <div className="error-state">
            <h2>Profile Not Available</h2>
            <p>Please login to view your profile.</p>
            <Link to="/login" className="btn btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="container">
        <motion.div
          className="profile-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-header">
            <h1>User Profile 👤</h1>
            <p>Manage your account and view your grievance history</p>
          </div>

          <div className="profile-content">
            {/* Profile Sidebar */}
            <div className="profile-sidebar">
              <div className="profile-avatar">
                <div className="avatar-container">
                  <FaUser />
                  <div className="avatar-edit">
                    <FaEdit />
                  </div>
                </div>
                <h2 className="profile-name">{userData.username}</h2>
                <p className="profile-username">@{userData.username.toLowerCase()}</p>
              </div>

              <div className="profile-stats">
                <div className="stat-card">
                  <div className="stat-number">{userData.grievancesSubmitted || 0}</div>
                  <div className="stat-label">Grievances</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{userData.grievancesResolved || 0}</div>
                  <div className="stat-label">Resolved</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{userData.karma || 0}</div>
                  <div className="stat-label">Karma</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {userData.joinDate ? formatDistanceToNow(new Date(userData.joinDate), { addSuffix: true }) : 'New'}
                  </div>
                  <div className="stat-label">Member</div>
                </div>
              </div>

              <div className="profile-actions">
                <button 
                  className={`action-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser />
                  Profile Info
                </button>
                <button 
                  className={`action-btn ${activeTab === 'grievances' ? 'active' : ''}`}
                  onClick={() => setActiveTab('grievances')}
                >
                  <FaFileAlt />
                  My Grievances
                </button>
                <Link to="/submit" className="action-btn">
                  <FaEdit />
                  Submit New
                </Link>
              </div>
            </div>

            {/* Profile Main Content */}
            <div className="profile-main">
              <div className="profile-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <FaUser />
                  Profile Information
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'grievances' ? 'active' : ''}`}
                  onClick={() => setActiveTab('grievances')}
                >
                  <FaFileAlt />
                  My Grievances ({userGrievances.length})
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'profile' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form className="profile-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="username">
                            <FaUser />
                            Username
                          </label>
                          <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleFormChange}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="relationshipStatus">
                            <FaHeart />
                            Relationship Status
                          </label>
                          <select
                            id="relationshipStatus"
                            name="relationshipStatus"
                            value={formData.relationshipStatus}
                            onChange={handleFormChange}
                            disabled={!isEditing}
                          >
                            {relationshipStatuses.map(status => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="email">
                          <FaEnvelope />
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label htmlFor="bio">
                          <FaUser />
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleFormChange}
                          disabled={!isEditing}
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="form-actions">
                        {isEditing ? (
                          <>
                            <motion.button
                              type="button"
                              className="save-btn"
                              onClick={handleSaveProfile}
                              disabled={isLoading}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FaSave />
                              Save Changes
                            </motion.button>
                            <motion.button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setIsEditing(false)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <FaTimes />
                              Cancel
                            </motion.button>
                          </>
                        ) : (
                          <motion.button
                            type="button"
                            className="save-btn"
                            onClick={() => setIsEditing(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FaEdit />
                            Edit Profile
                          </motion.button>
                        )}
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'grievances' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {userGrievances.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <FaFileAlt />
                        </div>
                        <h3>No grievances yet</h3>
                        <p>Start sharing your relationship woes to see them here!</p>
                        <Link to="/submit" className="save-btn">
                          <FaEdit />
                          Submit Your First Grievance
                        </Link>
                      </div>
                    ) : (
                      <div className="grievances-grid">
                        {userGrievances.map((grievance) => (
                          <motion.div
                            key={grievance._id}
                            className="grievance-item"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="grievance-header">
                              <h3 className="grievance-title">{grievance.title}</h3>
                              <span className="grievance-date">
                                {formatDistanceToNow(new Date(grievance.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <span className="grievance-category">{grievance.category}</span>
                            <p className="grievance-description">
                              {grievance.description.length > 150
                                ? `${grievance.description.substring(0, 150)}...`
                                : grievance.description
                              }
                            </p>
                            <div className="grievance-footer">
                              <span className={`grievance-status ${getStatusClass(grievance.status)}`}>
                                {grievance.status}
                              </span>
                              <div className="grievance-stats">
                                <span><FaThumbsUp /> {grievance.likes?.length || 0}</span>
                                <span><FaComments /> {grievance.comments?.length || 0}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile; 