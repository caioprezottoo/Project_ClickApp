import React from 'react'

import styles from './Movie.module.css'

export const Movie = (props) => {
    return (
        <div className={styles.movieDiv}>
            {props.movies.map((movie, index) => <div>
                <img src={movie.Poster} alt='movie'></img>
            </div>)}
            {props.movies.map((movie, index) => <div>
                <h2>{movie.Title}</h2>
            </div>)}
        </div>
    )
}