import React from 'react';
import styles from './Reviewed.module.css';

import { Loading } from './Loading';
import { NavBar } from './NavBar';

export const Reviewed = () => {
  return (
    <div className={styles.movielistdiv}>
      <Loading />
      <h1>Reviewed</h1>
      <NavBar />
    </div>
  )
}