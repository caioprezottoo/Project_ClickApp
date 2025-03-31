import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { NavBar } from './NavBar';
import { Loading } from './Loading';
import {
    signOut,
    updateEmail,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential
} from 'firebase/auth';
import {
    doc,
    getDoc,
    updateDoc,
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
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isEmailEditing, setIsEmailEditing] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;

                if (currentUser) {
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

    const checkEmailExists = async (email) => {
        try {
            // Check if email exists in users collection
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            return !querySnapshot.empty;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    const handleEmailUpdate = async (e) => {
        e.preventDefault();

        if (newEmail === user.email) {
            setMessage({ text: 'New email is the same as current email.', type: 'error' });
            return;
        }

        try {
            setLoading(true);

            // Check if email already exists
            const emailExists = await checkEmailExists(newEmail);

            if (emailExists) {
                setMessage({ text: 'This email is already in use. Please use a different email.', type: 'error' });
                setLoading(false);
                return;
            }

            // Reauthenticate user before updating email
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );

            await reauthenticateWithCredential(auth.currentUser, credential);

            // Update email in authentication
            await updateEmail(auth.currentUser, newEmail);

            // Update email in Firestore
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                email: newEmail
            });

            // Update local state
            setUser(prev => ({
                ...prev,
                email: newEmail
            }));

            setNewEmail('');
            setCurrentPassword('');
            setIsEmailEditing(false);
            setMessage({ text: 'Email updated successfully!', type: 'success' });
        } catch (error) {
            console.error('Error updating email:', error);

            if (error.code === 'auth/wrong-password') {
                setMessage({ text: 'Incorrect password. Please try again.', type: 'error' });
            } else if (error.code === 'auth/requires-recent-login') {
                setMessage({ text: 'Please log out and log back in before changing your email.', type: 'error' });
            } else {
                setMessage({ text: 'Failed to update email. Please try again.', type: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setLoading(true);
            const currentUser = auth.currentUser;

            if (currentUser) {
                // Delete user data from Firestore
                // 1. Delete user document
                await deleteDoc(doc(db, 'users', currentUser.uid));

                // 2. Delete user's reviews
                const reviewsRef = collection(db, 'reviews');
                const reviewsQuery = query(reviewsRef, where('userId', '==', currentUser.uid));
                const reviewsSnapshot = await getDocs(reviewsQuery);

                const deleteReviewPromises = reviewsSnapshot.docs.map(reviewDoc =>
                    deleteDoc(doc(db, 'reviews', reviewDoc.id))
                );
                await Promise.all(deleteReviewPromises);

                // 3. Delete user's favorites
                const favoritesRef = collection(db, 'favorites');
                const favoritesQuery = query(favoritesRef, where('userId', '==', currentUser.uid));
                const favoritesSnapshot = await getDocs(favoritesQuery);

                const deleteFavoritePromises = favoritesSnapshot.docs.map(favoriteDoc =>
                    deleteDoc(doc(db, 'favorites', favoriteDoc.id))
                );
                await Promise.all(deleteFavoritePromises);

                // 4. Finally delete the user authentication account
                await deleteUser(currentUser);

                // Redirect to home page
                window.location.href = "/";
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessage({ text: 'Failed to delete account. You may need to log in again before deleting.', type: 'error' });
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.background}>
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
                            <p>
                                <span className={styles.label}>Email:</span>
                                {isEmailEditing ? (
                                    <form onSubmit={handleEmailUpdate} className={styles.editForm}>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="New email address"
                                            required
                                            className={styles.input}
                                        />
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Current password"
                                            required
                                            className={styles.input}
                                        />
                                        <div className={styles.buttonGroup}>
                                            <button type="submit" className={styles.saveButton}>
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEmailEditing(false);
                                                    setNewEmail('');
                                                    setCurrentPassword('');
                                                }}
                                                className={styles.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <span>{user?.email}</span>
                                        <button
                                            onClick={() => {
                                                setIsEmailEditing(true);
                                                setNewEmail(user?.email || '');
                                            }}
                                            className={styles.editButton}
                                        >
                                            Edit
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className={styles.actionButtons}>
                        <button onClick={logOut} className={styles.logoutButton}>
                            Log Out
                        </button>

                        {!showConfirmDelete ? (
                            <button
                                onClick={() => setShowConfirmDelete(true)}
                                className={styles.deleteButton}
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
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmDelete(false)}
                                        className={styles.cancelButton}
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