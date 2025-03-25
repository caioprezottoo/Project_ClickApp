import React from 'react';
import { FilmSlate, ListHeart, User, Star } from '@phosphor-icons/react/dist/ssr';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

export const NavBar = () => {
    const location = useLocation();
    const activeRoute = location.pathname;

    return (
        <div className={styles.divNavBar}>
            <nav>
                <ul className={styles.ulNavBar}>
                    <li className={styles.liNavBar}>
                        <Link
                            to="/Home"
                            className={`${styles.icoNavBar} ${activeRoute === '/Home' ? styles.selected : ''}`}
                        >
                            <FilmSlate size={27} />
                        </Link>
                        <p className={`${styles.pNavBar} ${activeRoute === '/Home' ? styles.selected : ''}`}>Movies</p>
                    </li>
                    <li>
                        <Link
                            to="/MovieList"
                            className={`${styles.icoNavBar} ${activeRoute === '/MovieList' ? styles.selected : ''}`}
                        >
                            <Star size={27} />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/Profile"
                            className={`${styles.icoNavBar} ${activeRoute === '/Profile' ? styles.selected : ''}`}
                        >
                            <ListHeart size={27} />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/Profile"
                            className={`${styles.icoNavBar} ${activeRoute === '/Profile' ? styles.selected : ''}`}
                        >
                            <User size={27} />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
