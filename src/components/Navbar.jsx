import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {

    const { setShowLogin, user, credit, logout } = useContext(AppContext)

    const navigate = useNavigate()

    return (
        <div className='flex items-center justify-between py-4'>
            <Link to='/'><img className='w-28 sm:w-32 lg:w-40' src={assets.logo} alt="" /></Link>

            <div className='flex items-center gap-4'>
                {/* Theme Toggle */}
                <ThemeToggle />
                
                {
                    user
                        ? <div className='flex items-center gap-2 sm:gap-3'>
                            <button onClick={() => navigate('/buy')} className='flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700'>
                                <img className='w-5' src={assets.credit_star} alt="" />
                                <p className='text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300'>Credits left : {credit}</p>
                            </button>
                            <button onClick={() => navigate('/history')} className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all'>
                                History
                            </button>
                            <p className='text-gray-600 dark:text-gray-300 max-sm:hidden pl-4'>Hi, {user.name}</p>
                            <div className='relative group'>
                                <img className='w-10 h-10 object-cover rounded-full drop-shadow cursor-pointer border border-gray-200 dark:border-gray-600' src={user.profilePicture || assets.profile_icon} alt="" />
                                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black dark:text-white rounded pt-12'>
                                    <ul className='list-none m-0 p-2 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 shadow-lg text-sm min-w-[120px]'>
                                        <li onClick={() => navigate('/profile')} className='py-2 px-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2'>
                                            <span>👤</span> Profile
                                        </li>
                                        <li onClick={() => navigate('/history')} className='py-2 px-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2'>
                                            <span>📷</span> History
                                        </li>
                                        <li onClick={() => navigate('/buy')} className='py-2 px-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2'>
                                            <span>⭐</span> Buy Credits
                                        </li>
                                        {user.role === 'admin' && (
                                            <li onClick={() => navigate('/admin')} className='py-2 px-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2'>
                                                <span>⚙️</span> Admin
                                            </li>
                                        )}
                                        <hr className='my-1 border-gray-200 dark:border-gray-600' />
                                        <li onClick={logout} className='py-2 px-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded flex items-center gap-2'>
                                            <span>🚪</span> Logout
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        : <div className='flex items-center gap-2 sm:gap-5'>
                            <p onClick={() => navigate('/buy')} className='cursor-pointer text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'>Pricing</p>
                            <button onClick={() => setShowLogin(true)} className='bg-zinc-800 dark:bg-zinc-700 text-white px-7 py-2 sm:px-10 sm:py-2 text-sm rounded-full hover:bg-zinc-900 dark:hover:bg-zinc-600 transition-colors'>
                                Login
                            </button>
                        </div>
                }
            </div>
        </div>
    )
}

export default Navbar