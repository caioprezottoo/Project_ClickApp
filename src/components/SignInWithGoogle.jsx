import React from 'react'
import styles from './SignInWithGoogle.module.css'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth, db } from '../config/firebase'

import { toast } from 'react-toastify';

import { doc, setDoc } from 'firebase/firestore';

export const SignInWithGoogle = () => {
    function googleLogin() {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider).then(async (result) => {
            console.log(result);
            const user = result.currentUser;

            if (result.user) {
                await setDoc(doc(db, 'users', auth.currentUser.uid), {
                    email: auth.currentUser.email,

                });
                toast.success("User registration successful", {
                    position: "top-center",
                })
                window.location.href = "/Home"
            }
        })
    }

    return (
        <div className={styles.signinwithgooglediv}>
            <h1 className={styles.spanH1}>or</h1>
            <button
                className={styles.googleButton}
                onClick={googleLogin}
            >Sign in with Google</button>
        </div>
    )
}
