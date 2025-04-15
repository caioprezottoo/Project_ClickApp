# Click - Movie Review App

![Click Logo](src/assets/logo.png)

## Overview
Click is a modern, responsive web application designed to help movie enthusiasts keep track of the films they've watched, add personal ratings, and manage favorites. Built with React and Firebase, Click offers a seamless user experience for tracking and reviewing your movie-watching journey.

## Features

### User Authentication
- Email and password registration/login with email verification
- Google Sign-In integration
- User profile management

### Movie Management
- Browse movies from a curated collection
- Add custom movies to your personal collection
- Rate and review movies you've watched
- Save favorites for later reference

### User Interface
- Modern, responsive design
- Intuitive swipe-based navigation for movie discovery
- Clean layout for movie details and reviews
- Loading animations for a polished user experience

## Pages

### Authentication
- Initial welcome page
- Login page
- Registration page

### Core Functionality
- Home (Movie discovery)
- Reviewed Movies
- Add Movies
- Favorites
- User Profile

## Technologies Used

### Frontend
- React
- React Router for navigation
- CSS Modules for styling
- Phosphor Icons

### Backend
- Firebase Authentication
- Firebase Firestore Database
- Real-time data synchronization

## Project Structure 
```markdown
src/
├── assets/             Images and static files
├── components/         UI components
├── config/             Firebase configuration
├── context/            React context for state management
├── global.css          Global CSS variables and styles
├── App.jsx             Main app component with routes
└── main.jsx            Application entry point
```

## Key Components
- App.jsx: Main application component with routing
- AuthContext.jsx: Context provider for authentication state
- Home.jsx: Movie discovery with like/dislike functionality
- Reviewed.jsx: Display and manage reviewed movies
- Favorites.jsx: Saved favorite movies
- AddMovie.jsx: Add custom movies to your collection
- Profile.jsx: User profile and account management

## Acknowledgments
- React
- Firebase
- Phosphor Icons
- React Router
