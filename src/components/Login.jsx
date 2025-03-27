import React, { useState } from 'react';
import styles from './Login.module.css';

import { Loading } from './Loading';
import { ArrowLeft } from 'phosphor-react';

import { Link } from 'react-router-dom';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { SignInWithGoogle } from './SignInWithGoogle';
import { toast } from 'react-toastify';

export const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password)
            const user = auth.currentUser;
            if (user.emailVerified) {
                toast.success("User log in successful", {
                    position: "top-center",
                })
                window.location.href = "/Home"
            } else {
                toast.error("Email not verified. Please verify your email.", {
                    position: "top-center",
                })
            }
        } catch (error) {
            console.error(error.message);
            toast.error(error.message, {
                position: "top-center",
            })
        }
    }

    return (
        <div className={styles.background}>

            <title>Login - Click</title>
            <Loading />

            <Link to="/">
                <button className={styles.backButton}><ArrowLeft size={29} /></button>
            </Link>

            <h1 className={styles.firstTitle}>Welcome Back!</h1>
            <p>Log in to enjoy the ultimate reviewing app in the whole world wide web!</p>

            <input
                placeholder='Email'
                className={styles.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                placeholder='Password'
                className={styles.placeholder}
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                className={styles.submitButton}
                onClick={handleSubmit}
            >Submit</button>

            <SignInWithGoogle />

        </div>
    )
}