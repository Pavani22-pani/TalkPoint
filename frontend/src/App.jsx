import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route,Navigate  } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/UseThemeStore'
import {Toaster} from "react-hot-toast"


export const App = () => {
  const { authUser ,isCheckingAuth,onlineUsers} = useAuthStore()
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const theme=useThemeStore()
  console.log(onlineUsers)
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  console.log({ authUser })

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> :<Navigate to="/login"/>} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage/> :<Navigate to="/login"/>} />
      </Routes>
      <Toaster/>

    </div>
  )
}

export default App