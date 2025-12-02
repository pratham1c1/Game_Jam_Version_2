import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import UserGames from './pages/ProfileGames/UserGames'
import GameDetails from './pages/GameDetails/GameDetails'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BrowseGames from './pages/BrowsePage/BrowseGames'
import UserProfile from './pages/ProfilePage/UserProfile'
import HomePage from './pages/HomePage/HomePage'
import SignUp from './pages/SignUpPage/SignUP'
import Login from './pages/LoginPage/Login'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className='AppPage'>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} /> 
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/BrowseGames" element={<BrowseGames />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/UserGames" element={<UserGames />} />
            <Route path="/GameDetailsPage" element={<GameDetails />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App