import React from 'react';
import styles from './NavBar.module.css';

import { FilmSlate, ListHeart, User, Star } from '@phosphor-icons/react/dist/ssr';
import { Link, useLocation } from 'react-router-dom';

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
                            <FilmSlate size={20} />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/Reviewed"
                            className={`${styles.icoNavBar} ${activeRoute === '/Reviewed' ? styles.selected : ''}`}
                        >
                            <Star size={20} />
                        </Link>

                    </li>
                    <li>
                        <Link
                            to="/Favorites"
                            className={`${styles.icoNavBar} ${activeRoute === '/Favorites' ? styles.selected : ''}`}
                        >
                            <ListHeart size={20} />
                        </Link>

                    </li>
                    <li>
                        <Link
                            to="/Profile"
                            className={`${styles.icoNavBar} ${activeRoute === '/Profile' ? styles.selected : ''}`}
                        >
                            <User size={20} />
                        </Link>

                    </li>
                </ul>
            </nav>
        </div>
    );
};
