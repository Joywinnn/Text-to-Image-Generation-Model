import React, { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import History from './pages/History'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import Verify from './pages/Verify'

const AppContent = () => {
  const { showLogin } = useContext(AppContext)

  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 transition-colors'>
      <ToastContainer position='bottom-right' />
      <Navbar />
      {showLogin && <Login />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/result' element={<Result />} />
        <Route path='/buy' element={<BuyCredit />} />
        <Route path='/history' element={<History />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/verify' element={<Verify />} />
      </Routes>
      <Footer />
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App