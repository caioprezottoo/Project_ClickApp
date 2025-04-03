import React, { useState, useEffect } from 'react';
import styles from './Reviewed.module.css';
import { Loading } from './Loading';
import { NavBar } from './NavBar';
import { collection, query, where, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Star, X, Heart } from 'phosphor-react';

export const Reviewed = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favoriteStates, setFavoriteStates] = useState({});
  const [favoriteInProgress, setFavoriteInProgress] = useState({});

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

        // Check which reviews are already favorited
        await checkFavoritedStatus(fetchedReviews);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Function to check which movies are already in favorites
  const checkFavoritedStatus = async (fetchedReviews) => {
    try {
      const userId = auth.currentUser.uid;
      const favoritesRef = collection(db, 'favorites');
      const favoritesSnapshot = await getDocs(query(favoritesRef, where('userId', '==', userId)));

      const favoritedMovieIds = favoritesSnapshot.docs.map(doc => doc.data().movieId);

      const initialFavoriteStates = {};
      fetchedReviews.forEach(review => {
        initialFavoriteStates[review.id] = favoritedMovieIds.includes(review.movieId);
      });

      setFavoriteStates(initialFavoriteStates);
    } catch (error) {
      console.error('Error checking favorited status:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));

      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const handleAddToFavorites = async (review) => {
    // Prevent multiple clicks
    if (favoriteInProgress[review.id]) return;

    try {
      setFavoriteInProgress(prev => ({ ...prev, [review.id]: true }));

      const userId = auth.currentUser.uid;
      const favoritesRef = collection(db, 'favorites');

      // Check if movie is already in favorites
      const q = query(
        favoritesRef,
        where('userId', '==', userId),
        where('movieId', '==', review.movieId)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Add to favorites
        await addDoc(collection(db, 'favorites'), {
          userId: userId,
          movieId: review.movieId,
          movieCover: review.movieCover,
          isFavoriteOrNo: true,
          addedAt: new Date()
        });

        // Update state
        setFavoriteStates(prev => ({
          ...prev,
          [review.id]: true
        }));
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    } finally {
      setFavoriteInProgress(prev => ({ ...prev, [review.id]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.background}>
        <Loading />
        <NavBar />
      </div>
    );
  }

  return (
    <div className={styles.movielistdiv}>
      <title>Reviewed - Click</title>

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
                alt={review.movieTitle}
              />
              <div className={styles.reviewContent}>
                <h3>{review.movieTitle}</h3>
                <div className={styles.ratingDisplay}>
                  {[...Array(review.rating)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      weight="fill"
                      color="var(--white)"
                    />
                  ))}
                  {[...Array(5 - review.rating)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      weight="regular"
                      color="#E0E0E0"
                    />
                  ))}
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button
                  className={`${styles.favoriteButton} ${favoriteStates[review.id] ? styles.favorited : ''}`}
                  onClick={() => handleAddToFavorites(review)}
                  disabled={favoriteStates[review.id] || favoriteInProgress[review.id]}
                  title={favoriteStates[review.id] ? "Already in favorites" : "Add to favorites"}
                >
                  <Heart
                    size={18}
                    weight={favoriteStates[review.id] ? "fill" : "regular"}
                  />
                </button>

                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteReview(review.id)}
                  title="Delete review"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <NavBar />
    </div>
  );
};