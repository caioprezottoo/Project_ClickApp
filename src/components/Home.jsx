import React, { useState } from 'react'
import styles from './Home.module.css'
import { Eye, EyeSlash } from 'phosphor-react';

import { Loading } from './Loading'
import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

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

    const logOut = async () => {
        try {
            await signOut(auth)
            window.location.href = "/"
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className={styles.background}>
            <title>Home - Click</title>
            <Loading />

            <h1 className={styles.homeH1}>Home</h1>
            <span>
                <Movie movies={movies} />
            </span>
            <div className={styles.buttonsDiv}>
                <button className={styles.watchedButton}><Eye size={32} /> Watched </button>
                <button className={styles.didntwatchButton}><EyeSlash size={32} /> Didn't Watch</button>
            </div>

            <NavBar />

            <button onClick={logOut}>Log out</button>


        </div>
    )
}