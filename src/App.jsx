import { LoginRegistration } from './components/LoginRegistration'
import { Login } from './components/Login'
import './global.css'

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/LoginRegistration' element={<LoginRegistration />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}