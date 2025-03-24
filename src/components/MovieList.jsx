import React from 'react'

import { NavBar } from './NavBar'
import { Loading } from './Loading'

import styles from './MovieList.module.css'

export const MovieList = () => {
  return (
    <div className={styles.movielistdiv}>
        <Loading />
        <h1>List of Films</h1>
        <NavBar />
    </div>
  )
}