import React from 'react'
import styles from './Login.module.css'

import { Loading } from './Loading'

import { Link } from'react-router-dom'

import { ArrowLeft } from 'phosphor-react';

export const Login = () => {
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
            />
            <input
                placeholder='Password'
                className={styles.placeholder}
            />
            <button
                className={styles.submitButton}
            >Submit</button>

            <h1 className={styles.spanH1}>or</h1>
            <button className={styles.googleButton}>Log in with Google</button>
        </div>
    )
}