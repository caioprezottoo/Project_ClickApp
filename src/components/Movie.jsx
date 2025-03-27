import React from 'react';
import styles from './Movie.module.css';

export const Movie = ({ movie }) => {
    if (!movie) {
        return <div>No movie to display</div>;
    }

    return (
        <div className={styles.movieDiv}>
            <div key={movie.id}>
                <img
                    src={movie.cover}
                    className={styles.movieImage}
                />
                <h2>{movie.title}</h2>
            </div>
        </div>
    );
};