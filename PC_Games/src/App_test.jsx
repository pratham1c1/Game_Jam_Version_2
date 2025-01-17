import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'


import UserGames from './pages/ProfileGames/UserGames'
import GameDetails from './pages/GameDetails/GameDetails'
import Header from './components/PageHeader/Header'
import CommonHeader from './components/PageHeader/CommonHeader'
import SideNav from './components/BrowseSideNav/SideNav';
import BrowseGames from './pages/BrowsePage/BrowseGames';
import GameCards from './components/GameTemplate/GameCards';
import PopupForm from './components/PopupForm/PopupForm';
import CommentTemplate from './components/CommentTemplate/commentTemplate';
import UserProfile from './pages/ProfilePage/UserProfile';



function App_test() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='AppPage'>
        <Router>
          <Routes>
            <Route path="/" element={<UserProfile />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App_test