import React from 'react'
import { House, List, User } from 'phosphor-react';

import styles from './NavBar.module.css'


export const NavBar = () => {
    function changeToHome() {
        window.location.href = "/Home"
    }

    function changeToFilmList() {
        window.location.href = "/FilmList"
    }

    return (
        <div className={styles.divNavBar}>
            <nav className={styles.nav}>
                <ul className={styles.ulNavBar}>
                    <li><a href="/Home" className={styles.icoNavBar}><House size={29} /></a></li>
                    <li><a href="/FilmList" className={styles.icoNavBar}><List size={29} /></a></li>
                    <li><a className={styles.icoNavBar}><User size={29} /></a></li>
                </ul>
            </nav>
        </div>
    )
}