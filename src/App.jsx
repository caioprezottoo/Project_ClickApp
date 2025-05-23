import { LoginRegistration } from './components/LoginRegistration'
import { InitialPage } from './components/InitialPage'
import { Login } from './components/Login'
import './global.css'

import { ToastContainer } from 'react-toastify'

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/Home'
import { Reviewed } from './components/Reviewed'
import { Profile } from './components/Profile'
import { Favorites } from './components/Favorites'
import { AuthProvider } from './context/AuthContext';
import { AddMovie } from './components/AddMovie'

export function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<InitialPage />} />
            <Route path='/LoginRegistration' element={<LoginRegistration />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Home' element={<Home />} />
            <Route path='/Reviewed' element={<Reviewed />} />
            <Route path='/Profile' element={<Profile />} />
            <Route path='/Favorites' element={<Favorites />} />
            <Route path='/AddMovie' element={<AddMovie />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </ AuthProvider>
    </>
  )
}