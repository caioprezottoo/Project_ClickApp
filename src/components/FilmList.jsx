import React from 'react'

import { NavBar } from './NavBar'
import { Loading } from './Loading'

export const FilmList = () => {
  return (
    <div>
        <Loading />
        <h1>List of Films</h1>
        <NavBar />
    </div>
  )
}