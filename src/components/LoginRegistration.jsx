import styles from './LoginRegistration.module.css'
import { Loading } from './Loading'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'phosphor-react';

export function LoginRegistration() {
    return (
        <div>
            <Loading />

            <title>Login and Registration - Click</title>

            <div className={styles.background}>
                <Link to="/">
                    <button className={styles.backButton}><ArrowLeft size={29} /></button>
                </Link>
                
                <h1 className={styles.firstTitle}>Go ahead and set up your account</h1>
                <p>Sign in to enjoy the ultimate reviewing app in the whole world wide web!</p>
                <span className={styles.spanBackground}>
                    <h1 className={styles.spanH1}>Welcome!</h1>
                    <p className={styles.spanP}>Let's get you all set up! Don't forget any step in the way.</p>

                    <input placeholder='Email' className={styles.placeholder} />
                    <input placeholder='Password' className={styles.placeholder} />
                    <button className={styles.submitButton}>Submit</button>

                    <h1 className={styles.spanH1}>or</h1>
                    <button className={styles.googleButton}>Sign in with Google</button>
                </span>

            </div>

        </div>
    )
}