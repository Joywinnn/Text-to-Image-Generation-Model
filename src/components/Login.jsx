import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const Login = () => {
    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const { backendUrl, setShowLogin, setToken, setUser } = useContext(AppContext)

    // Password strength checker
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, color: 'gray', text: '' }
        
        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++

        const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green']
        const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
        
        return {
            strength: Math.min(strength, 5),
            color: colors[strength - 1] || 'gray',
            text: texts[strength - 1] || ''
        }
    }

    // Email validation
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    // Form validation
    const validateForm = () => {
        const newErrors = {}

        if (state === 'Sign Up') {
            if (!name.trim()) {
                newErrors.name = 'Name is required'
            } else if (name.trim().length < 2) {
                newErrors.name = 'Name must be at least 2 characters'
            }

            if (!validateEmail(email)) {
                newErrors.email = 'Please enter a valid email address'
            }

            if (password.length < 8) {
                newErrors.password = 'Password must be at least 8 characters'
            }

            if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match'
            }
        } else {
            if (!validateEmail(email)) {
                newErrors.email = 'Please enter a valid email address'
            }

            if (!password) {
                newErrors.password = 'Password is required'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                    toast.success('Login successful!')
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

                if (data.success) {
                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    setShowLogin(false)
                    toast.success('Account created successfully!')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Something went wrong'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleStateChange = (newState) => {
        setState(newState)
        setErrors({})
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    const passwordStrength = getPasswordStrength(password)

    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center p-4'>
            <motion.form onSubmit={onSubmitHandler} 
                className='relative bg-white p-8 rounded-xl text-slate-500 w-full max-w-md'
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h1 className='text-center text-2xl text-neutral-700 font-medium mb-2'>{state}</h1>
                <p className='text-sm text-center text-gray-600 mb-6'>
                    {state === 'Login' ? 'Welcome back! Please sign in to continue' : 'Create your account to get started'}
                </p>

                {state === 'Sign Up' && (
                    <div className='mb-4'>
                        <div className='border px-4 py-3 flex items-center gap-3 rounded-lg'>
                            <img src={assets.email_icon} alt="" className='w-4 h-4' />
                            <input 
                                onChange={e => setName(e.target.value)} 
                                value={name} 
                                className='outline-none text-sm flex-1' 
                                type="text" 
                                placeholder='Full Name' 
                                required 
                            />
                        </div>
                        {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
                    </div>
                )}

                <div className='mb-4'>
                    <div className='border px-4 py-3 flex items-center gap-3 rounded-lg'>
                        <img src={assets.email_icon} alt="" className='w-4 h-4' />
                        <input 
                            onChange={e => setEmail(e.target.value)} 
                            value={email} 
                            className='outline-none text-sm flex-1' 
                            type="email" 
                            placeholder='Email address' 
                            required 
                        />
                    </div>
                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                </div>

                <div className='mb-4'>
                    <div className='border px-4 py-3 flex items-center gap-3 rounded-lg'>
                        <img src={assets.lock_icon} alt="" className='w-4 h-4' />
                        <input 
                            onChange={e => setPassword(e.target.value)} 
                            value={password} 
                            className='outline-none text-sm flex-1' 
                            type={showPassword ? "text" : "password"} 
                            placeholder='Password' 
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='text-gray-500 hover:text-gray-700'
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
                    
                    {state === 'Sign Up' && password && (
                        <div className='mt-2'>
                            <div className='flex gap-1 mb-1'>
                                {[1, 2, 3, 4, 5].map((level) => (
                                    <div 
                                        key={level}
                                        className={`h-1 flex-1 rounded ${
                                            level <= passwordStrength.strength 
                                                ? `bg-${passwordStrength.color}` 
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className={`text-xs text-${passwordStrength.color}`}>
                                {passwordStrength.text}
                            </p>
                        </div>
                    )}
                </div>

                {state === 'Sign Up' && (
                    <div className='mb-4'>
                        <div className='border px-4 py-3 flex items-center gap-3 rounded-lg'>
                            <img src={assets.lock_icon} alt="" className='w-4 h-4' />
                            <input 
                                onChange={e => setConfirmPassword(e.target.value)} 
                                value={confirmPassword} 
                                className='outline-none text-sm flex-1' 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder='Confirm Password' 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='text-gray-500 hover:text-gray-700'
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword}</p>}
                    </div>
                )}

                {state === 'Login' && (
                    <p className='text-sm text-blue-600 my-4 cursor-pointer hover:text-blue-800'>
                        Forgot password?
                    </p>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className='bg-blue-600 w-full text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                    {loading ? (
                        <div className='flex items-center justify-center gap-2'>
                            <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                            {state === 'Login' ? 'Signing in...' : 'Creating account...'}
                        </div>
                    ) : (
                        state === 'Login' ? 'Sign In' : 'Create Account'
                    )}
                </button>

                <div className='mt-6 text-center'>
                    {state === "Login" ? (
                        <p className='text-sm'>
                            Don't have an account?{' '}
                            <span 
                                onClick={() => handleStateChange('Sign Up')} 
                                className='text-blue-600 cursor-pointer hover:text-blue-800 font-medium'
                            >
                                Sign up
                            </span>
                        </p>
                    ) : (
                        <p className='text-sm'>
                            Already have an account?{' '}
                            <span 
                                onClick={() => handleStateChange('Login')} 
                                className='text-blue-600 cursor-pointer hover:text-blue-800 font-medium'
                            >
                                Sign in
                            </span>
                        </p>
                    )}
                </div>

                <button 
                    type="button"
                    onClick={() => setShowLogin(false)} 
                    className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl'
                >
                    ✕
                </button>
            </motion.form>
        </div>
    )
}

export default Login