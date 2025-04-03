import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { NavBar } from './NavBar';
import { Loading } from './Loading';
import { signOut, deleteUser } from 'firebase/auth';
import {
    doc,
    getDoc,
    deleteDoc,
    collection,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showConfirmDeleteFavorites, setShowConfirmDeleteFavorites] = useState(false);
    const [showConfirmDeleteReviews, setShowConfirmDeleteReviews] = useState(false);
    const [showConfirmDeleteMovies, setShowConfirmDeleteMovies] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const [actionInProgress, setActionInProgress] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;

                if (currentUser) {
                    // Check if the user is signed in with Google
                    const isGoogle = currentUser.providerData.some(
                        provider => provider.providerId === 'google.com'
                    );

                    setIsGoogleUser(isGoogle);

                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

                    if (userDoc.exists()) {
                        setUser({
                            ...currentUser,
                            ...userDoc.data()
                        });
                    } else {
                        setUser(currentUser);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const logOut = async () => {
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Failed to log out. Please try again.', type: 'error' });
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setActionInProgress(true);
            const currentUser = auth.currentUser;

            if (currentUser) {
                // Delete user data from Firestore
                await deleteDoc(doc(db, 'users', currentUser.uid));

                // Delete user's reviews
                await handleDeleteAllReviews(false);

                // Delete user's favorites
                await handleDeleteAllFavorites(false);

                // Delete user's personal movies
                await handleDeleteAllMovies(false);

                // Delete the user account itself
                await deleteUser(currentUser);

                window.location.href = "/";
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessage({ text: 'Failed to delete account. You may need to log in again before deleting.', type: 'error' });
            setActionInProgress(false);
        }
    };

    const handleDeleteAllFavorites = async (showMessage = true) => {
        try {
            if (showMessage) setActionInProgress(true);
            const userId = auth.currentUser.uid;

            // Get all user's favorites
            const favoritesRef = collection(db, 'favorites');
            const favoritesQuery = query(favoritesRef, where('userId', '==', userId));
            const favoritesSnapshot = await getDocs(favoritesQuery);

            if (favoritesSnapshot.empty && showMessage) {
                setMessage({ text: 'You don\'t have any favorites to delete.', type: 'info' });
                setActionInProgress(false);
                return;
            }

            // Delete all favorites
            const deleteFavoritePromises = favoritesSnapshot.docs.map(favoriteDoc =>
                deleteDoc(doc(db, 'favorites', favoriteDoc.id))
            );
            await Promise.all(deleteFavoritePromises);

            if (showMessage) {
                setMessage({ text: 'All favorites deleted successfully!', type: 'success' });
                setShowConfirmDeleteFavorites(false);
                setActionInProgress(false);
            }
        } catch (error) {
            console.error('Error deleting favorites:', error);
            if (showMessage) {
                setMessage({ text: 'Failed to delete favorites. Please try again.', type: 'error' });
                setActionInProgress(false);
            }
        }
    };

    const handleDeleteAllReviews = async (showMessage = true) => {
        try {
            if (showMessage) setActionInProgress(true);
            const userId = auth.currentUser.uid;

            // Get all user's reviews
            const reviewsRef = collection(db, 'reviews');
            const reviewsQuery = query(reviewsRef, where('userId', '==', userId));
            const reviewsSnapshot = await getDocs(reviewsQuery);

            if (reviewsSnapshot.empty && showMessage) {
                setMessage({ text: 'You don\'t have any reviews to delete.', type: 'info' });
                setActionInProgress(false);
                return;
            }

            // Delete all reviews
            const deleteReviewPromises = reviewsSnapshot.docs.map(reviewDoc =>
                deleteDoc(doc(db, 'reviews', reviewDoc.id))
            );
            await Promise.all(deleteReviewPromises);

            if (showMessage) {
                setMessage({ text: 'All reviews deleted successfully!', type: 'success' });
                setShowConfirmDeleteReviews(false);
                setActionInProgress(false);
            }
        } catch (error) {
            console.error('Error deleting reviews:', error);
            if (showMessage) {
                setMessage({ text: 'Failed to delete reviews. Please try again.', type: 'error' });
                setActionInProgress(false);
            }
        }
    };

    const handleDeleteAllMovies = async (showMessage = true) => {
        try {
            if (showMessage) setActionInProgress(true);
            const userId = auth.currentUser.uid;

            // Get all user's personal movies
            const moviesUserRef = collection(db, 'moviesUser');
            const moviesUserQuery = query(moviesUserRef, where('addedBy', '==', userId));
            const moviesUserSnapshot = await getDocs(moviesUserQuery);

            if (moviesUserSnapshot.empty && showMessage) {
                setMessage({ text: 'You don\'t have any added movies to delete.', type: 'info' });
                setActionInProgress(false);
                return;
            }

            // Delete all personal movies
            const deleteMoviesUserPromises = moviesUserSnapshot.docs.map(movieDoc =>
                deleteDoc(doc(db, 'moviesUser', movieDoc.id))
            );
            await Promise.all(deleteMoviesUserPromises);

            if (showMessage) {
                setMessage({ text: 'All your added movies deleted successfully!', type: 'success' });
                setShowConfirmDeleteMovies(false);
                setActionInProgress(false);
            }
        } catch (error) {
            console.error('Error deleting user movies:', error);
            if (showMessage) {
                setMessage({ text: 'Failed to delete your movies. Please try again.', type: 'error' });
                setActionInProgress(false);
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <Loading />
            </div>
        );
    }

    return (
        <div className={styles.background}>
            <title>Profile - Click</title>

            <div className={styles.profileContainer}>
                <h1 className={styles.profileTitle}>Your Profile</h1>

                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}

                <div className={styles.profileCard}>
                    <div className={styles.profileSection}>
                        <h2>Account Information</h2>

                        <div className={styles.profileInfo}>
                            <div className={styles.profileField}>
                                <span className={styles.label}>Email:</span>
                                <div className={styles.emailContainer}>
                                    <span className={styles.emailText}>{user?.email}</span>
                                    {isGoogleUser && (
                                        <span className={styles.providerTag}>Google Account</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.dataManagementSection}>
                        <h2>Data Management</h2>

                        {!showConfirmDeleteFavorites ? (
                            <button
                                onClick={() => setShowConfirmDeleteFavorites(true)}
                                className={styles.dataButton}
                                disabled={actionInProgress}
                            >
                                Delete All Favorites
                            </button>
                        ) : (
                            <div className={styles.confirmDelete}>
                                <p>Delete all your favorites?</p>
                                <div className={styles.buttonGroup}>
                                    <button
                                        onClick={() => handleDeleteAllFavorites()}
                                        className={styles.confirmDeleteButton}
                                        disabled={actionInProgress}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmDeleteFavorites(false)}
                                        className={styles.cancelButton}
                                        disabled={actionInProgress}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {!showConfirmDeleteReviews ? (
                            <button
                                onClick={() => setShowConfirmDeleteReviews(true)}
                                className={styles.dataButton}
                                disabled={actionInProgress}
                            >
                                Delete All Reviews
                            </button>
                        ) : (
                            <div className={styles.confirmDelete}>
                                <p>Delete all your reviews?</p>
                                <div className={styles.buttonGroup}>
                                    <button
                                        onClick={() => handleDeleteAllReviews()}
                                        className={styles.confirmDeleteButton}
                                        disabled={actionInProgress}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmDeleteReviews(false)}
                                        className={styles.cancelButton}
                                        disabled={actionInProgress}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {!showConfirmDeleteMovies ? (
                            <button
                                onClick={() => setShowConfirmDeleteMovies(true)}
                                className={styles.dataButton}
                                disabled={actionInProgress}
                            >
                                Delete All My Movies
                            </button>
                        ) : (
                            <div className={styles.confirmDelete}>
                                <p>Delete all movies you've added?</p>
                                <div className={styles.buttonGroup}>
                                    <button
                                        onClick={() => handleDeleteAllMovies()}
                                        className={styles.confirmDeleteButton}
                                        disabled={actionInProgress}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmDeleteMovies(false)}
                                        className={styles.cancelButton}
                                        disabled={actionInProgress}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.actionButtons}>
                        <button
                            onClick={logOut}
                            className={styles.logoutButton}
                            disabled={actionInProgress}
                        >
                            Log Out
                        </button>

                        {!showConfirmDelete ? (
                            <button
                                onClick={() => setShowConfirmDelete(true)}
                                className={styles.deleteButton}
                                disabled={actionInProgress}
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div className={styles.confirmDelete}>
                                <p>Are you sure? This cannot be undone.</p>
                                <div className={styles.buttonGroup}>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className={styles.confirmDeleteButton}
                                        disabled={actionInProgress}
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmDelete(false)}
                                        className={styles.cancelButton}
                                        disabled={actionInProgress}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <NavBar />
        </div>
    );
};