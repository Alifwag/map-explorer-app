import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ThumbsUp, 
  Flag, 
  User,
  MoreVertical,
  MessageSquare,
  Image
} from 'lucide-react';

const Reviews = ({ placeId, reviews: initialReviews = [] }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: {
        name: 'Budi Santoso',
        avatar: null,
        reviews: 45
      },
      rating: 4.5,
      date: '2024-01-15',
      text: 'Tempat yang sangat bagus! Pelayanan ramah dan makanan enak. Cocok untuk keluarga. Pasti akan kembali lagi.',
      photos: [],
      likes: 23,
      liked: false
    },
    {
      id: 2,
      user: {
        name: 'Siti Rahayu',
        avatar: null,
        reviews: 12
      },
      rating: 5,
      date: '2024-01-10',
      text: 'Sangat recommended! Lokasinya strategis, mudah dijangkau. Harga terjangkau dengan kualitas terbaik.',
      photos: ['photo1.jpg', 'photo2.jpg'],
      likes: 45,
      liked: true
    },
    {
      id: 3,
      user: {
        name: 'Ahmad Rizki',
        avatar: null,
        reviews: 78
      },
      rating: 3.5,
      date: '2024-01-05',
      text: 'Cukup baik, tapi pelayanan perlu ditingkatkan. Makanan enak, parkir luas.',
      photos: [],
      likes: 5,
      liked: false
    }
  ]);
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, text: '' });

  const sortOptions = [
    { id: 'newest', label: 'Terbaru' },
    { id: 'highest', label: 'Rating Tertinggi' },
    { id: 'lowest', label: 'Rating Terendah' },
    { id: 'most_liked', label: 'Paling Disukai' }
  ];

  const getSortedReviews = () => {
    const sorted = [...reviews];
    switch(sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'most_liked':
        return sorted.sort((a, b) => b.likes - a.likes);
      default:
        return sorted;
    }
  };

  const handleLike = (reviewId) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? {
              ...review,
              likes: review.liked ? review.likes - 1 : review.likes + 1,
              liked: !review.liked
            }
          : review
      )
    );
  };

  const handleSubmitReview = () => {
    if (newReview.rating === 0 || !newReview.text.trim()) return;

    const review = {
      id: Date.now(),
      user: {
        name: 'Pengguna',
        avatar: null,
        reviews: 1
      },
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      text: newReview.text,
      photos: [],
      likes: 0,
      liked: false
    };

    setReviews(prev => [review, ...prev]);
    setNewReview({ rating: 0, text: '' });
    setShowReviewForm(false);
  };

  const StarRating = ({ rating, size = 16, interactive = false, onChange }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            className={`star ${star <= rating ? 'filled' : ''}`}
            onClick={() => interactive && onChange?.(star)}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
          >
            <Star 
              size={size} 
              fill={star <= rating ? '#ffa502' : 'none'} 
              color={star <= rating ? '#ffa502' : '#ccc'}
            />
          </motion.button>
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 1-5 stars
    reviews.forEach(review => {
      const index = Math.floor(review.rating) - 1;
      if (index >= 0 && index < 5) distribution[index]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews || 0;

  return (
    <div className="reviews-container">
      {/* Rating Summary */}
      <div className="rating-summary">
        <div className="rating-score">
          <span className="score-value">{averageRating.toFixed(1)}</span>
          <StarRating rating={Math.round(averageRating)} />
          <span className="total-reviews">{totalReviews} ulasan</span>
        </div>
        
        <div className="rating-distribution">
          {distribution.reverse().map((count, index) => (
            <div key={index} className="distribution-row">
              <span className="distribution-label">{5 - index} ⭐</span>
              <div className="distribution-bar">
                <div 
                  className="distribution-fill"
                  style={{ 
                    width: totalReviews > 0 ? `${(count / totalReviews) * 100}%` : '0%' 
                  }}
                />
              </div>
              <span className="distribution-count">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort & Add Review */}
      <div className="reviews-header">
        <div className="sort-filter">
          {sortOptions.map(option => (
            <button
              key={option.id}
              className={`sort-btn ${sortBy === option.id ? 'active' : ''}`}
              onClick={() => setSortBy(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <motion.button
          className="add-review-btn"
          onClick={() => setShowReviewForm(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquare size={16} />
          Tulis Ulasan
        </motion.button>
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            className="review-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <h4>Tulis Ulasan Anda</h4>
            
            <div className="form-group">
              <label>Rating</label>
              <StarRating 
                rating={newReview.rating} 
                interactive 
                onChange={(rating) => setNewReview(prev => ({ ...prev, rating }))} 
                size={32}
              />
            </div>

            <div className="form-group">
              <label>Ulasan</label>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Bagikan pengalaman Anda..."
                rows={4}
              />
            </div>

            <div className="form-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                Batal
              </button>
              <button 
                className="submit-btn"
                onClick={handleSubmitReview}
                disabled={!newReview.rating || !newReview.text.trim()}
              >
                Kirim Ulasan
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="reviews-list">
        {getSortedReviews().map((review, index) => (
          <motion.div
            key={review.id}
            className="review-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="review-header">
              <div className="reviewer-info">
                <div className="avatar">
                  {review.user.avatar ? (
                    <img src={review.user.avatar} alt={review.user.name} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div>
                  <div className="reviewer-name">{review.user.name}</div>
                  <div className="reviewer-stats">
                    {review.user.reviews} ulasan
                  </div>
                </div>
              </div>

              <div className="review-meta">
                <div className="review-date">{review.date}</div>
                <button className="more-btn">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="review-content">
              <StarRating rating={review.rating} />
              <p className="review-text">{review.text}</p>
              
              {review.photos.length > 0 && (
                <div className="review-photos">
                  {review.photos.map((photo, i) => (
                    <div key={i} className="review-photo">
                      <Image size={16} />
                      <span>Foto {i + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="review-footer">
              <button 
                className={`like-btn ${review.liked ? 'liked' : ''}`}
                onClick={() => handleLike(review.id)}
              >
                <ThumbsUp size={14} fill={review.liked ? '#0066ff' : 'none'} />
                <span>{review.likes} Suka</span>
              </button>
              
              <button className="report-btn">
                <Flag size={14} />
                <span>Laporkan</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .reviews-container {
          padding: 16px;
        }

        .rating-summary {
          display: flex;
          gap: 24px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea15, #764ba215);
          border-radius: 16px;
          margin-bottom: 20px;
        }

        .rating-score {
          text-align: center;
          min-width: 100px;
        }

        .score-value {
          font-size: 48px;
          font-weight: 800;
          color: var(--text-primary);
          display: block;
          line-height: 1;
        }

        .total-reviews {
          font-size: 12px;
          color: var(--text-secondary);
          display: block;
          margin-top: 4px;
        }

        .rating-distribution {
          flex: 1;
        }

        .distribution-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .distribution-label {
          font-size: 11px;
          color: var(--text-secondary);
          min-width: 30px;
        }

        .distribution-bar {
          flex: 1;
          height: 6px;
          background: var(--border-color);
          border-radius: 3px;
          overflow: hidden;
        }

        .distribution-fill {
          height: 100%;
          background: #ffa502;
          border-radius: 3px;
          transition: width 0.3s;
        }

        .distribution-count {
          font-size: 11px;
          color: var(--text-secondary);
          min-width: 20px;
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 12px;
        }

        .sort-filter {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .sort-btn {
          padding: 6px 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          font-size: 11px;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s;
        }

        .sort-btn.active {
          background: var(--accent-color);
          color: white;
          border-color: var(--accent-color);
        }

        .add-review-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: var(--accent-color);
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
        }

        .review-form {
          background: var(--bg-secondary);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 16px;
          overflow: hidden;
        }

        .review-form h4 {
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-group label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .star-rating {
          display: flex;
          gap: 4px;
        }

        .star {
          background: none;
          border: none;
          padding: 0;
          transition: all 0.2s;
        }

        textarea {
          width: 100%;
          padding: 10px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 13px;
          resize: vertical;
          font-family: inherit;
        }

        textarea:focus {
          outline: none;
          border-color: var(--accent-color);
        }

        .form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .cancel-btn {
          padding: 8px 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 13px;
          cursor: pointer;
        }

        .submit-btn {
          padding: 8px 16px;
          background: var(--accent-color);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 13px;
          cursor: pointer;
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .review-item {
          padding: 16px;
          background: var(--bg-secondary);
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .reviewer-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: #667eea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .reviewer-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .reviewer-stats {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .review-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .review-date {
          font-size: 11px;
          color: var(--text-secondary);
        }

        .more-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
        }

        .review-text {
          font-size: 13px;
          color: var(--text-primary);
          line-height: 1.6;
          margin: 12px 0;
        }

        .review-photos {
          display: flex;
          gap: 8px;
          margin: 12px 0;
        }

        .review-photo {
          width: 80px;
          height: 80px;
          background: var(--bg-primary);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .review-footer {
          display: flex;
          gap: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-color);
        }

        .like-btn,
        .report-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 12px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .like-btn:hover,
        .report-btn:hover {
          background: var(--bg-primary);
        }

        .like-btn.liked {
          color: #0066ff;
        }

        @media (max-width: 768px) {
          .rating-summary {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .reviews-header {
            flex-direction: column;
          }

          .sort-filter {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Reviews;