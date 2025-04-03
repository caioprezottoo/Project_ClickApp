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
        const fetchMovies = async () => {
            try {
                const userId = auth.currentUser.uid;

                // Get user's reviewed movie IDs
                const reviewsRef = collection(db, 'reviews');
                const reviewsQuery = query(reviewsRef, where('userId', '==', userId));
                const reviewSnapshot = await getDocs(reviewsQuery);
                const reviewedMovieIds = reviewSnapshot.docs.map(doc => doc.data().movieId);

                // Get movies from public collection
                const publicMoviesCollection = collection(db, 'movies');
                const publicMovieSnapshot = await getDocs(publicMoviesCollection);
                const publicMovies = publicMovieSnapshot.docs
                    .filter(doc => !reviewedMovieIds.includes(doc.id))
                    .map(doc => ({ id: doc.id, ...doc.data() }));

                // Get user's personal movies
                const userMoviesCollection = collection(db, 'moviesUser');
                const userMoviesQuery = query(userMoviesCollection, where('addedBy', '==', userId));
                const userMovieSnapshot = await getDocs(userMoviesQuery);
                const userMovies = userMovieSnapshot.docs
                    .filter(doc => !reviewedMovieIds.includes(doc.id))
                    .map(doc => ({ id: doc.id, ...doc.data() }));

                // Combine both collections
                const allMovies = [...publicMovies, ...userMovies];

                setMovies(allMovies);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setIsLoading(false);
            }
        };

        fetchMovies();
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
        if (addingToFavorites) return;

        try {
            setAddingToFavorites(true);

            const currentMovie = movies[currentMovieIndex];
            const userId = auth.currentUser.uid;

            const favoritesRef = collection(db, 'favorites');
            const q = query(
                favoritesRef,
                where('userId', '==', userId),
                where('movieId', '==', currentMovie.id)
            );

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(collection(db, 'favorites'), {
                    userId: userId,
                    movieId: currentMovie.id,
                    movieCover: currentMovie.poster || currentMovie.image || currentMovie.cover || '',
                    isFavoriteOrNo: true,
                    addedAt: new Date()
                });

                setShowFavoriteAnimation(true);

                setTimeout(() => {
                    setShowFavoriteAnimation(false);
                }, 1000);
            } else {
                console.log('This movie is already in your favorites!');
            }
        } catch (error) {
            console.error('Error adding to favorites:', error);
            console.log('Failed to add to favorites. Please try again.');
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
            <NavBar />
        </div>
    );
};