import React, { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { Eye, EyeSlash, Plus, Heart } from 'phosphor-react';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { Movie } from './Movie';
import { NavBar } from './NavBar';
import { Loading } from './Loading';
import { ReviewModal } from './ReviewModal';

export const Home = () => {
    const [movies, setMovies] = useState([]);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [addingToFavorites, setAddingToFavorites] = useState(false);
    const [showFavoriteAnimation, setShowFavoriteAnimation] = useState(false);

    useEffect(() => {
        const fetchUnreviewedMovies = async () => {
            try {
                const userId = auth.currentUser.uid;

                const reviewsRef = collection(db, 'reviews');
                const reviewsQuery = query(reviewsRef, where('userId', '==', userId));
                const reviewSnapshot = await getDocs(reviewsQuery);
                const reviewedMovieIds = reviewSnapshot.docs.map(doc => doc.data().movieId);

                const moviesCollection = collection(db, 'movies');
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs
                    .filter(doc => !reviewedMovieIds.includes(doc.id))
                    .map(doc => ({ id: doc.id, ...doc.data() }));

                setMovies(movieList);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching unreviewed movies:', error);
                setIsLoading(false);
            }
        };

        fetchUnreviewedMovies();
    }, []);

    const handleDidntWatch = () => {
        setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % movies.length);
    };

    const handleWatched = () => {
        setShowReviewModal(true);
    };

    const handleReviewSubmit = () => {
        setShowReviewModal(false);

        const updatedMovies = movies.filter((_, index) => index !== currentMovieIndex);
        setMovies(updatedMovies);

        setCurrentMovieIndex(0);
    };

    const handleAddToFavorites = async () => {
        if (addingToFavorites) return; // Prevent multiple clicks

        try {
            setAddingToFavorites(true);

            const currentMovie = movies[currentMovieIndex];
            const userId = auth.currentUser.uid;

            // Check if movie is already in favorites
            const favoritesRef = collection(db, 'favorites');
            const q = query(
                favoritesRef,
                where('userId', '==', userId),
                where('movieId', '==', currentMovie.id)
            );

            const querySnapshot = await getDocs(q);

            // Only add if not already a favorite
            if (querySnapshot.empty) {
                await addDoc(collection(db, 'favorites'), {
                    userId: userId,
                    movieId: currentMovie.id,
                    movieCover: currentMovie.poster || currentMovie.image || currentMovie.cover || '',
                    isFavoriteOrNo: true,
                    addedAt: new Date()
                });

                // Trigger animation
                setShowFavoriteAnimation(true);

                // Hide animation after it finishes
                setTimeout(() => {
                    setShowFavoriteAnimation(false);
                }, 1000);
            } else {
                alert('This movie is already in your favorites!');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
            alert('Failed to add to favorites. Please try again.');
        } finally {
            setAddingToFavorites(false);
        }
    };

    if (isLoading) {
        return <div><Loading /></div>;
    }

    if (movies.length === 0) {
        return (
            <div className={styles.background}>
                <h2>No more movies to review!</h2>
                <NavBar />
            </div>
        );
    }

    const currentMovie = movies[currentMovieIndex];

    return (
        <div className={styles.background}>
            <title>Home - Click</title>
            {showReviewModal && (
                <ReviewModal
                    movie={currentMovie}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={handleReviewSubmit}
                />
            )}
            <span>
                <Movie movie={currentMovie} />
            </span>
            <div className={styles.buttonsDiv}>
                <button
                    className={styles.watchedButton}
                    onClick={handleWatched}
                >
                    <Eye size={32} /> Watched
                </button>
                <button
                    className={`${styles.addButton} ${showFavoriteAnimation ? styles.addButtonActive : ''}`}
                    onClick={handleAddToFavorites}
                    disabled={addingToFavorites}
                >
                    {showFavoriteAnimation ?
                        <Heart size={24} weight="fill" className={styles.favoriteIcon} /> :
                        <Plus size={24} weight="bold" />
                    }
                </button>
                <button
                    className={styles.didntwatchButton}
                    onClick={handleDidntWatch}
                >
                    <EyeSlash size={32} /> Didn't Watch
                </button>
            </div>
            {showFavoriteAnimation && (
                <div className={styles.floatingHearts}>
                    <Heart size={20} weight="fill" className={`${styles.floatingHeart} ${styles.heart1}`} />
                    <Heart size={16} weight="fill" className={`${styles.floatingHeart} ${styles.heart2}`} />
                    <Heart size={24} weight="fill" className={`${styles.floatingHeart} ${styles.heart3}`} />
                </div>
            )}
            <NavBar />
        </div>
    );
};