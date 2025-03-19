import Logo from '../assets/logo.png'
import styles from './Login.module.css'

export function Login() {
    return (
        <div className={styles.background}>
            <title>Login - Click</title>

            <img src={Logo} alt="logo 'Click'" className={styles.logo}/>

            <p className={styles.paragraph}>Get ready to review your favorite movies and series.</p>
            
            <button className={styles.getStarted}>Get Started</button>
            <button className={styles.logIn}>Log in</button>
        </div>
    )
}