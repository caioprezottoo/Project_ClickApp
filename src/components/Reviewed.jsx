import React, { useState, useEffect } from 'react';
import styles from './Reviewed.module.css';
import { Loading } from './Loading';
import { NavBar } from './NavBar';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Star, X } from 'phosphor-react';

export const Reviewed = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('userId', '==', auth.currentUser.uid));

        const querySnapshot = await getDocs(q);
        const fetchedReviews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setReviews(fetchedReviews);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));

      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.movielistdiv}>
        <Loading />
        <NavBar />
      </div>
    );
  }

  return (
    <div className={styles.movielistdiv}>
      <h1>Already Watched & Reviewed</h1>
      {reviews.length === 0 ? (
        <p className={styles.noReviews}>No movies reviewed yet</p>
      ) : (
        <div className={styles.reviewList}>
          {reviews.map((review) => (
            <div key={review.id} className={styles.reviewItem}>
              <img
                src={review.movieCover}
                className={styles.movieImage}
              />
              <div className={styles.reviewContent}>
                <h3>{review.movieTitle}</h3>
                <div className={styles.ratingDisplay}>
                  {[...Array(review.rating)].map((_, index) => (
                    <Star
                      key={index}
                      size={24}
                      weight="fill"
                      color="#FFD700"
                    />
                  ))}
                  {[...Array(5 - review.rating)].map((_, index) => (
                    <Star
                      key={index}
                      size={24}
                      weight="regular"
                      color="#E0E0E0"
                    />
                  ))}
                </div>
              </div>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteReview(review.id)}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
      <NavBar />
    </div>
  );
};