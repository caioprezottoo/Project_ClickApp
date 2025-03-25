import React from 'react'
import { NavBar } from './NavBar'
import styles from './Reviewed.module.css'

export const Reviewed = () => {
  return (
    <div className={styles.movielistdiv}>
        <h1>Reviewed</h1>
        <NavBar />
    </div>
  )
}