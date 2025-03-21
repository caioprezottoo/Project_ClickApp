import styles from './LoginRegistration.module.css'
import { Loading } from './Loading'
import { ArrowLeft } from 'phosphor-react';

import { useState } from 'react';
import { Link } from 'react-router-dom'

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export function LoginRegistration() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            if (user) {
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,

                });
            }
            toast.success("User registration successful", {
                position: "top-center",
            })
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
            })

        }


    }

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

                <input
                    placeholder='Email'
                    className={styles.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    placeholder='Password'
                    className={styles.placeholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className={styles.submitButton}
                    onClick={handleRegister}
                >Submit</button>

                <h1 className={styles.spanH1}>or</h1>
                <button className={styles.googleButton}>Sign in with Google</button>

            </div>

        </div>
    )
}