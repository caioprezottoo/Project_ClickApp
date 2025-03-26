import React, { useEffect, useState } from 'react'
import styles from './Home.module.css'
import { Eye, EyeSlash, Plus } from 'phosphor-react';

import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase';

import { Movie } from './Movie';
import { NavBar } from './NavBar';

export const Home = () => {
    const [movies, setMovies] = useState([]);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

    useEffect(() => {
        const fetchMovies = async () => {
            const moviesCollection = collection(db, 'movies');
            const movieSnapshot = await getDocs(moviesCollection);
            const movieList = movieSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMovies(movieList);
        };

        fetchMovies();
    }, []);

    const handleDidntWatch = () => {
        setCurrentMovieIndex((prevIndex) =>
            (prevIndex + 1) % movies.length
        );
    };

    const handleWatched = () => {
        setCurrentMovieIndex((prevIndex) =>
            (prevIndex + 1) % movies.length
        );
    };

    if (movies.length === 0) {
        return <div>Loading movies...</div>;
    }

    const currentMovie = movies[currentMovieIndex];

    return (
        <div className={styles.background}>
            <title>Home - Click</title>

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
                <button className={styles.addButton}>
                    <Plus size={24} weight="bold" />
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
    )
}