import React from 'react';
import { NavBar } from './NavBar';

import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

import { Loading } from './Loading';

export const Profile = () => {
    const logOut = async () => {
        try {
            await signOut(auth)
            window.location.href = "/"
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <Loading />

            <title>Profile - Click</title>
            <button onClick={logOut}>Log out</button>
            <NavBar />


        </div>
    )
}
