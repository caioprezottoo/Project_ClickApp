import React from 'react';
import { House, List, User } from 'phosphor-react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

export const NavBar = () => {
    const location = useLocation();
    const activeRoute = location.pathname;

    return (
        <div className={styles.divNavBar}>
            <nav className={styles.nav}>
                <ul className={styles.ulNavBar}>
                    <li>
                        <Link
                            to="/Home"
                            className={`${styles.icoNavBar} ${activeRoute === '/Home' ? styles.selected : ''}`}
                        >
                            <House size={29} />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/MovieList"
                            className={`${styles.icoNavBar} ${activeRoute === '/MovieList' ? styles.selected : ''}`}
                        >
                            <List size={29} />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/Profile"
                            className={`${styles.icoNavBar} ${activeRoute === '/Profile' ? styles.selected : ''}`}
                        >
                            <User size={29} />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
