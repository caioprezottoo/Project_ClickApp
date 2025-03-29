import React, { useState } from 'react';
import { X, Star } from 'phosphor-react';
import styles from './ReviewModal.module.css';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

export const ReviewModal = ({ movie, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async () => {
    if (rating > 0) {
      try {
        await addDoc(collection(db, 'reviews'), {
          userId: auth.currentUser.uid,
          movieId: movie.id,
          rating: rating,
          movieTitle: movie.title,
          movieCover: movie.cover,
          reviewedAt: new Date()
        });

        onSubmit();
      } catch (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
      }
    } else {
      alert('Please select a rating before submitting.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Rate: {movie.title}</h2>
        <div className={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={45}
              weight={(hoveredRating || rating) >= star ? 'fill' : 'regular'}
              color={((hoveredRating || rating) >= star) ? 'var(--white)' : '#E0E0E0'}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className={styles.starIcon}
            />
          ))}
        </div>
        <div className={styles.ratingText}>
          {rating > 0 ? `${rating}/5 Stars` : 'Select your rating'}
        </div>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={rating === 0}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};