import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { NavBar } from './NavBar';
import { Loading } from './Loading';
import {
    signOut,
    updateEmail,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
    GoogleAuthProvider
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
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isEmailEditing, setIsEmailEditing] = useState(false);
    const [isReauthenticating, setIsReauthenticating] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);

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

    const checkEmailExists = async (email) => {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            return !querySnapshot.empty;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    const handleReauthenticate = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Create credential with current email and password
            const credential = EmailAuthProvider.credential(
                auth.currentUser.email,
                password
            );

            // Reauthenticate
            await reauthenticateWithCredential(auth.currentUser, credential);

            // Proceed with email update
            await updateEmailAfterReauth();

        } catch (error) {
            console.error('Error reauthenticating:', error);
            setMessage({ text: 'Incorrect password. Please try again.', type: 'error' });
            setLoading(false);
        }
    };

    const updateEmailAfterReauth = async () => {
        try {
            const emailExists = await checkEmailExists(newEmail);

            if (emailExists) {
                setMessage({ text: 'This email is already in use. Please use a different email.', type: 'error' });
                setLoading(false);
                return;
            }

            // Update Firebase Auth email
            await updateEmail(auth.currentUser, newEmail);

            // Update Firestore document
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
            setPassword('');
            setIsEmailEditing(false);
            setIsReauthenticating(false);
            setMessage({
                text: 'Email updated successfully. Please verify your new email address.',
                type: 'success'
            });
        } catch (error) {
            console.error('Error updating email:', error);
            setMessage({ text: `Failed to update email: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleEmailUpdate = async (e) => {
        e.preventDefault();

        if (newEmail === user.email) {
            setMessage({ text: 'New email is the same as current email.', type: 'error' });
            return;
        }

        if (isGoogleUser) {
            setMessage({
                text: 'Google accounts cannot change their email through this app. Please update your email in your Google account settings.',
                type: 'error'
            });
            setIsEmailEditing(false);
            return;
        }

        // Show reauthentication form instead of directly updating
        setIsReauthenticating(true);
    };

    const handleDeleteAccount = async () => {
        try {
            setLoading(true);
            const currentUser = auth.currentUser;

            if (currentUser) {
                await deleteDoc(doc(db, 'users', currentUser.uid));

                const reviewsRef = collection(db, 'reviews');
                const reviewsQuery = query(reviewsRef, where('userId', '==', currentUser.uid));
                const reviewsSnapshot = await getDocs(reviewsQuery);

                const deleteReviewPromises = reviewsSnapshot.docs.map(reviewDoc =>
                    deleteDoc(doc(db, 'reviews', reviewDoc.id))
                );
                await Promise.all(deleteReviewPromises);

                const favoritesRef = collection(db, 'favorites');
                const favoritesQuery = query(favoritesRef, where('userId', '==', currentUser.uid));
                const favoritesSnapshot = await getDocs(favoritesQuery);

                const deleteFavoritePromises = favoritesSnapshot.docs.map(favoriteDoc =>
                    deleteDoc(doc(db, 'favorites', favoriteDoc.id))
                );
                await Promise.all(deleteFavoritePromises);

                await deleteUser(currentUser);

                window.location.href = "/";
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessage({ text: 'Failed to delete account. You may need to log in again before deleting.', type: 'error' });
            setLoading(false);
        }
    };

    const cancelEmailEdit = () => {
        setIsEmailEditing(false);
        setIsReauthenticating(false);
        setNewEmail('');
        setPassword('');
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
                                {isEmailEditing && isReauthenticating ? (
                                    <form onSubmit={handleReauthenticate} className={styles.editForm}>
                                        <p className={styles.reauthMessage}>
                                            Please enter your current password to confirm this change
                                        </p>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Your current password"
                                            required
                                            className={styles.input}
                                        />
                                        <div className={styles.buttonGroup}>
                                            <button type="submit" className={styles.saveButton}>
                                                Confirm
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEmailEdit}
                                                className={styles.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : isEmailEditing ? (
                                    <form onSubmit={handleEmailUpdate} className={styles.editForm}>
                                        <input
                                            type="email"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            placeholder="New email address"
                                            required
                                            className={styles.input}
                                        />
                                        <div className={styles.buttonGroup}>
                                            <button type="submit" className={styles.saveButton}>
                                                Update
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEmailEdit}
                                                className={styles.cancelButton}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className={styles.emailContainer}>
                                        <span className={styles.emailText}>{user?.email}</span>
                                        {!isGoogleUser && (
                                            <button
                                                onClick={() => {
                                                    setIsEmailEditing(true);
                                                    setNewEmail(user?.email || '');
                                                }}
                                                className={styles.editButton}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                )}
                                {isGoogleUser && !isEmailEditing && (
                                    <span className={styles.providerTag}>Google Account</span>
                                )}
                            </div>
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