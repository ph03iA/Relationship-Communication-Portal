import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaHeart, FaThumbsUp, FaComment, FaUser, FaCalendarAlt, FaTag, FaLock, FaReply, FaCheck } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import './Grievances.css';

const GrievanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [partnerResponse, setPartnerResponse] = useState('');
  const [responseLoading, setResponseLoading] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);

  // Mock grievance data for demonstration
  const mockGrievance = {
    _id: id,
    title: 'He never texts me back',
    description: 'My boyfriend takes hours to respond to my messages, even when he\'s online. It\'s driving me crazy! I feel like I\'m always the one initiating conversations and he just doesn\'t seem to care about staying in touch throughout the day. We\'ve been together for 2 years and this has been getting worse lately.',
    category: 'Communication',
    severity: 'High',
    status: 'Open',
    boyfriendName: 'John',
    relationshipDuration: '2-5 years',
    isAnonymous: false,
    tags: ['texting', 'communication', 'ignoring'],
    likes: ['user1', 'user2'],
    communicationStatus: 'Pending Response',
    partnerResponse: null,
    comments: [
      {
        user: { username: 'SupportiveFriend' },
        text: 'I totally understand! My ex was the same way. Have you tried talking to him about it?',
        date: new Date('2024-01-14'),
        isPartnerComment: false
      },
      {
        user: { username: 'RelationshipGuru' },
        text: 'This is a common issue. Try setting clear expectations about communication.',
        date: new Date('2024-01-13'),
        isPartnerComment: false
      }
    ],
    user: { username: 'GrievanceQueen' },
    partner: { username: 'John', _id: 'partner123' },
    createdAt: new Date('2024-01-15')
  };

  useEffect(() => {
    fetchGrievance();
    fetchUser();
    // eslint-disable-next-line
  }, [id]);

  const fetchGrievance = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/grievances/${id}`);
      if (response.ok) {
        const data = await response.json();
        setGrievance(data);
      } else {
        // Use mock data if API fails
        setGrievance(mockGrievance);
        console.log('Using mock grievance data');
      }
    } catch (error) {
      console.error('Error loading grievance:', error);
      // Use mock data on error
      setGrievance(mockGrievance);
      console.log('Using mock grievance data due to error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // For demo, use mock user
        setUser({ _id: '507f1f77bcf86cd799439011', username: 'GrievanceQueen', partner: 'partner123' });
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      // For demo, use mock user
      setUser({ _id: '507f1f77bcf86cd799439011', username: 'GrievanceQueen', partner: 'partner123' });
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like grievances');
      return;
    }
    setLikeLoading(true);
    try {
      const response = await fetch(`/api/grievances/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId: user._id }),
      });
      if (response.ok) {
        const updated = await response.json();
        setGrievance(updated);
      } else {
        // Update mock data if API fails
        const isLiked = grievance.likes && grievance.likes.includes(user._id);
        if (isLiked) {
          setGrievance(prev => ({
            ...prev,
            likes: prev.likes.filter(like => like !== user._id)
          }));
        } else {
          setGrievance(prev => ({
            ...prev,
            likes: [...(prev.likes || []), user._id]
          }));
        }
        toast.success(isLiked ? 'Unliked!' : 'Liked!');
      }
    } catch (error) {
      console.error('Error liking grievance:', error);
      // Update mock data on error
      const isLiked = grievance.likes && grievance.likes.includes(user._id);
      if (isLiked) {
        setGrievance(prev => ({
          ...prev,
          likes: prev.likes.filter(like => like !== user._id)
        }));
      } else {
        setGrievance(prev => ({
          ...prev,
          likes: [...(prev.likes || []), user._id]
        }));
      }
      toast.success(isLiked ? 'Unliked!' : 'Liked!');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!comment.trim()) return;
    setCommentLoading(true);
    try {
      const response = await fetch(`/api/grievances/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ text: comment }),
      });
      if (response.ok) {
        const updated = await response.json();
        setGrievance(updated);
        setComment('');
        toast.success('Comment added!');
      } else {
        // Update mock data if API fails
        const newComment = {
          user: { username: user.username },
          text: comment,
          date: new Date(),
          isPartnerComment: user.partner === grievance.user._id
        };
        setGrievance(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newComment]
        }));
        setComment('');
        toast.success('Comment added!');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      // Update mock data on error
      const newComment = {
        user: { username: user.username },
        text: comment,
        date: new Date(),
        isPartnerComment: user.partner === grievance.user._id
      };
      setGrievance(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));
      setComment('');
      toast.success('Comment added!');
    } finally {
      setCommentLoading(false);
    }
  };

  const handlePartnerResponse = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to respond');
      return;
    }
    if (!partnerResponse.trim()) return;
    
    // Check if user is the partner
    if (!user.partner || grievance.user._id !== user.partner) {
      toast.error('Only the partner can respond to this grievance');
      return;
    }
    
    setResponseLoading(true);
    try {
      const response = await fetch(`/api/grievances/${id}/partner-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ response: partnerResponse }),
      });
      if (response.ok) {
        const updated = await response.json();
        setGrievance(updated);
        setPartnerResponse('');
        setShowResponseForm(false);
        toast.success('Response sent!');
      } else {
        // Update mock data if API fails
        setGrievance(prev => ({
          ...prev,
          partnerResponse: {
            text: partnerResponse,
            date: new Date(),
            isRead: false
          },
          communicationStatus: 'Responded'
        }));
        setPartnerResponse('');
        setShowResponseForm(false);
        toast.success('Response sent!');
      }
    } catch (error) {
      console.error('Error sending response:', error);
      // Update mock data on error
      setGrievance(prev => ({
        ...prev,
        partnerResponse: {
          text: partnerResponse,
          date: new Date(),
          isRead: false
        },
        communicationStatus: 'Responded'
      }));
      setPartnerResponse('');
      setShowResponseForm(false);
      toast.success('Response sent!');
    } finally {
      setResponseLoading(false);
    }
  };

  const markResponseAsRead = async () => {
    if (!grievance.partnerResponse || grievance.partnerResponse.isRead) return;
    
    try {
      const response = await fetch(`/api/grievances/${id}/mark-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setGrievance(prev => ({
          ...prev,
          partnerResponse: {
            ...prev.partnerResponse,
            isRead: true
          }
        }));
      }
    } catch (error) {
      console.error('Error marking response as read:', error);
    }
  };

  if (loading) {
    return (
      <div className="grievances-loading">
        <div className="spinner"></div>
        <p>Loading grievance details...</p>
      </div>
    );
  }

  if (!grievance) return null;

  const isLiked = user && grievance.likes && grievance.likes.includes(user._id);
  const isPartner = user && user.partner && grievance.user._id === user.partner;
  const canRespond = isPartner && grievance.communicationStatus === 'Pending Response';

  return (
    <div className="grievance-detail">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="detail-header">
            <Link to="/grievances" className="back-link">
              <FaArrowLeft />
              Back to Grievances
            </Link>
            <h1>{grievance.title} <FaHeart style={{ color: '#ff6b9d' }} /></h1>
            <div className="detail-meta">
              <span><FaUser /> {grievance.user?.username || 'Anonymous'}</span>
              <span><FaCalendarAlt /> {formatDistanceToNow(new Date(grievance.createdAt), { addSuffix: true })}</span>
              <span><FaTag /> {grievance.category}</span>
              <span className="grievance-severity" style={{ background: '#fd7e14', color: 'white', borderRadius: 8, padding: '2px 10px', marginLeft: 8 }}>{grievance.severity}</span>
              <span className="grievance-status" style={{ background: '#007bff', color: 'white', borderRadius: 8, padding: '2px 10px', marginLeft: 8 }}>{grievance.status}</span>
              <span className="communication-status" style={{ background: grievance.communicationStatus === 'Responded' ? '#28a745' : '#ffc107', color: 'white', borderRadius: 8, padding: '2px 10px', marginLeft: 8 }}>{grievance.communicationStatus}</span>
              {grievance.isAnonymous && <span style={{ marginLeft: 8 }}><FaLock /> Anonymous</span>}
            </div>
          </div>

          <div className="detail-content">
            <div className="grievance-description" style={{ fontSize: '1.1rem', marginBottom: 16 }}>{grievance.description}</div>
            <div className="grievance-details">
              <span>💔 Boyfriend: <b>{grievance.boyfriendName}</b></span>
              <span>⏰ Duration: <b>{grievance.relationshipDuration}</b></span>
              {grievance.tags && grievance.tags.length > 0 && (
                <span>Tags: {grievance.tags.map((tag, i) => <span key={i} className="tag">#{tag} </span>)}</span>
              )}
            </div>
            <div className="grievance-footer" style={{ marginTop: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
              <button className={`btn btn-secondary btn-small ${isLiked ? 'liked' : ''}`} onClick={handleLike} disabled={likeLoading}>
                <FaThumbsUp style={{ color: isLiked ? '#ff6b9d' : undefined }} /> {grievance.likes?.length || 0} Like{grievance.likes?.length === 1 ? '' : 's'}
              </button>
              <span><FaComment /> {grievance.comments?.length || 0} Comment{grievance.comments?.length === 1 ? '' : 's'}</span>
            </div>
          </div>

          {/* Partner Response Section */}
          {grievance.partnerResponse && (
            <motion.div 
              className="partner-response-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ marginTop: 30, padding: 20, background: 'rgba(102, 126, 234, 0.05)', borderRadius: 12, border: '1px solid rgba(102, 126, 234, 0.2)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
                <FaUser style={{ color: '#667eea' }} />
                <h3 style={{ margin: 0, color: '#667eea' }}>Partner Response</h3>
                {!grievance.partnerResponse.isRead && (
                  <span style={{ background: '#ffc107', color: 'white', padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem' }}>New</span>
                )}
                <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#666' }}>
                  {formatDistanceToNow(new Date(grievance.partnerResponse.date), { addSuffix: true })}
                </span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.6, color: '#333' }}>{grievance.partnerResponse.text}</p>
              {!grievance.partnerResponse.isRead && user && grievance.user._id === user._id && (
                <button 
                  onClick={markResponseAsRead}
                  style={{ marginTop: 10, background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}
                >
                  <FaCheck /> Mark as Read
                </button>
              )}
            </motion.div>
          )}

          {/* Partner Response Form */}
          {canRespond && (
            <motion.div 
              className="partner-response-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ marginTop: 30, padding: 20, background: '#f8f9fa', borderRadius: 12, border: '2px solid #667eea' }}
            >
              <h3 style={{ margin: '0 0 15px 0', color: '#667eea' }}>
                <FaReply /> Respond to Your Partner
              </h3>
              {!showResponseForm ? (
                <button 
                  onClick={() => setShowResponseForm(true)}
                  style={{ background: '#667eea', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontSize: '1rem' }}
                >
                  Write Response
                </button>
              ) : (
                <form onSubmit={handlePartnerResponse}>
                  <textarea
                    value={partnerResponse}
                    onChange={(e) => setPartnerResponse(e.target.value)}
                    placeholder="Write your response to your partner's grievance..."
                    style={{ width: '100%', minHeight: 100, padding: 12, border: '2px solid #e9ecef', borderRadius: 8, fontSize: '1rem', marginBottom: 15 }}
                    maxLength={1000}
                    required
                  />
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button 
                      type="submit" 
                      disabled={responseLoading || !partnerResponse.trim()}
                      style={{ background: '#667eea', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontSize: '1rem' }}
                    >
                      {responseLoading ? 'Sending...' : 'Send Response'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowResponseForm(false);
                        setPartnerResponse('');
                      }}
                      style={{ background: '#6c757d', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontSize: '1rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}

          {/* Comments Section */}
          <div className="comments-section" style={{ marginTop: 40 }}>
            <h3>Comments</h3>
            {grievance.comments && grievance.comments.length > 0 ? (
              <div className="comments-list">
                {grievance.comments.map((c, idx) => (
                  <div key={idx} className="comment-item" style={{ 
                    border: c.isPartnerComment ? '2px solid #667eea' : '1px solid #e9ecef',
                    background: c.isPartnerComment ? 'rgba(102, 126, 234, 0.05)' : 'white'
                  }}>
                    <span className="comment-user">
                      <FaUser /> {c.user?.username || 'Anonymous'}
                      {c.isPartnerComment && <span style={{ color: '#667eea', marginLeft: 8 }}>(Partner)</span>}
                    </span>
                    <span className="comment-date">{formatDistanceToNow(new Date(c.date), { addSuffix: true })}</span>
                    <div className="comment-text">{c.text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-comments">No comments yet. Be the first to comment!</div>
            )}
            <form className="comment-form" onSubmit={handleComment} style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              <input
                type="text"
                className="input"
                placeholder={user ? 'Write a comment...' : 'Login to comment'}
                value={comment}
                onChange={e => setComment(e.target.value)}
                disabled={!user || commentLoading}
                maxLength={300}
              />
              <button type="submit" className="btn btn-primary btn-small" disabled={!user || commentLoading || !comment.trim()}>
                {commentLoading ? 'Posting...' : 'Post'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GrievanceDetail; 