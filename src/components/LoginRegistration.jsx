import styles from './LoginRegistration.module.css'
import { Loading } from './Loading'
import { ArrowLeft } from 'phosphor-react';

import { useState } from 'react';
import { Link } from 'react-router-dom'

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { setDoc, doc, query, where, getDocs, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { SignInWithGoogle } from './SignInWithGoogle'

export function LoginRegistration() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                toast.error("This email is already registered.", {
                    position: "top-center",
                });
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                await setDoc(doc(db, 'users', user.uid), {
                    email: user.email,
                });
                await sendEmailVerification(user);
                toast.success("A verification was sent to your email!", {
                    position: "top-center",
                });
            }
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
            });
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
                    type='password'
                    className={styles.placeholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className={styles.submitButton}
                    onClick={handleRegister}
                >Submit</button>

                <SignInWithGoogle />

            </div>

        </div>
    )
}