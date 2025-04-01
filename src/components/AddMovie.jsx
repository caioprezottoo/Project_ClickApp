import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { NavBar } from './NavBar';
import styles from './AddMovie.module.css';

export const AddMovie = () => {
    const [title, setTitle] = useState('');
    const [cover, setCover] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ text: '', isError: false });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !cover.trim()) {
            setMessage({ text: 'Please fill in all fields', isError: true });
            return;
        }

        try {
            setIsSubmitting(true);
            setMessage({ text: '', isError: false });

            await addDoc(collection(db, 'movies'), {
                title: title.trim(),
                cover: cover.trim(),
                addedBy: auth.currentUser?.uid || 'anonymous',
                addedAt: new Date()
            });

            setTitle('');
            setCover('');
            setMessage({ text: 'Movie added successfully!', isError: false });

            setTimeout(() => {
                setMessage({ text: '', isError: false });
            }, 3000);
        } catch (error) {
            console.error('Error adding movie:', error);
            setMessage({ text: 'Failed to add movie. Please try again.', isError: true });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCoverInputChange = (e) => {
        setCover(e.target.value);
    };

    return (
        <div className={styles.container}>
            <title>Add Movie - Click</title>
            <div className={styles.content}>
                <h1 className={styles.title}>Add New Movie</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title" className={styles.label}>Movie Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter movie title"
                            className={styles.input}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="cover" className={styles.label}>Cover Image URL</label>
                        <input
                            type="url"
                            id="cover"
                            value={cover}
                            onChange={handleCoverInputChange}
                            placeholder="https://example.com/movie-cover.jpg"
                            className={styles.input}
                            disabled={isSubmitting}
                        />
                    </div>

                    {cover && (
                        <div className={styles.previewContainer}>
                            <p className={styles.previewLabel}>Cover Preview:</p>
                            <div className={styles.imagePreview}>
                                <img
                                    src={cover}
                                    alt="Movie cover preview"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/150x225?text=Invalid+URL';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {message.text && (
                        <div className={`${styles.message} ${message.isError ? styles.error : styles.success}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Add Movie'}
                    </button>
                </form>
            </div>

            <NavBar />
        </div>
    );
};