import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './SubmitGrievance.css';

const SubmitGrievance = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    severity: '',
    boyfriendName: '',
    relationshipDuration: '',
    isAnonymous: false,
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const severityLevels = [
    { value: 'Low', label: 'Low', color: '#28a745' },
    { value: 'Medium', label: 'Medium', color: '#ffc107' },
    { value: 'High', label: 'High', color: '#fd7e14' },
    { value: 'Critical', label: 'Critical', color: '#dc3545' }
  ];

  const relationshipDurations = [
    'Less than 6 months',
    '6 months - 1 year',
    '1-2 years',
    '2-5 years',
    'More than 5 years'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          userId: '507f1f77bcf86cd799439011' // Mock user ID
        }),
      });

      if (response.ok) {
        const grievance = await response.json();
        toast.success('Grievance submitted successfully! 💔');
        navigate(`/grievance/${grievance._id}`);
      } else {
        const error = await response.json();
        toast.error(error.msg || 'Failed to submit grievance');
      }
    } catch (error) {
      console.error('Error submitting grievance:', error);
      toast.error('Failed to submit grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submit-grievance">
      <div className="container">
        <motion.div
          className="submit-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Share Your Feelings 💕</h1>
          <p>Express your relationship concerns and start a conversation with your partner</p>
        </motion.div>

        <motion.div
          className="submit-form-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="submit-form">
            <div className="form-group">
              <label htmlFor="title">Issue Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="e.g., Communication concerns about texting"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input textarea"
                placeholder="Describe your feelings and concerns in detail..."
                required
                maxLength={1000}
                rows={6}
              />
              <div className="char-count">
                {formData.description.length}/1000 characters
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="severity">Importance Level *</label>
                <select
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select importance</option>
                  {severityLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="boyfriendName">Partner's Name *</label>
                <input
                  type="text"
                  id="boyfriendName"
                  name="boyfriendName"
                  value={formData.boyfriendName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your partner's name (or nickname)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="relationshipDuration">Relationship Duration *</label>
                <select
                  id="relationshipDuration"
                  name="relationshipDuration"
                  value={formData.relationshipDuration}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select duration</option>
                  {relationshipDurations.map(duration => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (optional)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input"
                placeholder="e.g., communication, trust, quality time (separate with commas)"
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="checkbox"
                />
                <span className="checkmark"></span>
                Share with community only (not with partner)
              </label>
            </div>

            <div className="form-actions">
              <motion.button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Sharing...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Share Feelings
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <motion.div
          className="submit-info"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="info-card">
            <h3>💡 Tips for Effective Communication</h3>
            <ul>
              <li>Express your feelings clearly and honestly</li>
              <li>Focus on how situations make you feel</li>
              <li>Choose the appropriate category and importance level</li>
              <li>Use tags to help others find similar experiences</li>
              <li>Consider sharing with your partner for better understanding</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitGrievance; 