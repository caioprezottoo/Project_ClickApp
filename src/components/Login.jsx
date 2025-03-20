import Logo from '../assets/logo.png'
import styles from './Login.module.css'

import { Link } from 'react-router-dom'

export function Login() {
    return (
        <div className={styles.background}>
            <title>Login - Click</title>

            <div className={styles.group}>
                <img src={Logo} alt="logo 'Click'" className={styles.logo} />

                <p className={styles.paragraph}>Get ready to review your favorite movies and series.</p>

                <Link to="/LoginRegistration">
                    <button className={styles.getStarted}>Get Started</button>
                </Link>
                <Link to="/LoginRegistration">
                    <button className={styles.logIn}>Log in</button>
                </Link>
            </div>
        </div>
    )
}