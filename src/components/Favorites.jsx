import React, { useEffect, useState } from 'react';
import styles from './Favorites.module.css';
import { NavBar } from './NavBar';
import { Loading } from './Loading';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { X } from 'phosphor-react';

export const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = auth.currentUser.uid;

        const favoritesRef = collection(db, 'favorites');
        const q = query(favoritesRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const favoritesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setFavorites(favoritesList);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await deleteDoc(doc(db, 'favorites', favoriteId));

      setFavorites(favorites.filter(favorite => favorite.id !== favoriteId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.background}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <title>Favorites - Click</title>
        <h1 className={styles.title}>My Favorites</h1>

        {favorites.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't added any favorites yet.</p>
          </div>
        ) : (
          <div className={styles.favoritesGrid}>
            {favorites.map(favorite => (
              <div key={favorite.id} className={styles.favoriteItem}>
                <div className={styles.movieCover}>
                  <img
                    src={favorite.movieCover}
                    alt="Movie Cover"
                    className={styles.coverImage}
                  />
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveFavorite(favorite.id)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <NavBar />
    </div>
  );
};