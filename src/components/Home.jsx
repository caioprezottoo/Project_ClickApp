import React, { useState } from 'react'
import styles from './Home.module.css'
import { Eye, EyeSlash, Plus } from 'phosphor-react';

import { Loading } from './Loading'

import { Movie } from './Movie';
import { NavBar } from './NavBar';

export const Home = () => {
    const [movies, setMovies] = useState([
        {
            "Title": "Star Wars: Episode IV - A New Hope",
            "Year": "1977",
            "imdbID": "tt0076759",
            "Type": "movie",
            "Poster": "https://m.media-amazon.com/images/M/MV5BOGUwMDk0Y2MtNjBlNi00NmRiLTk2MWYtMGMyMDlhYmI4ZDBjXkEyXkFqcGc@._V1_SX300.jpg"
        },
    ])


    return (
        <div className={styles.background}>
            <title>Home - Click</title>

            <span>
                <Movie movies={movies} />
            </span>
            <div className={styles.buttonsDiv}>
                <button className={styles.watchedButton}><Eye size={32} /> Watched </button>
                <button className={styles.addButton}><Plus size={24} weight="bold" /></button>
                <button className={styles.didntwatchButton}><EyeSlash size={32} /> Didn't Watch</button>
            </div>



            <NavBar />
        </div>
    )
}

