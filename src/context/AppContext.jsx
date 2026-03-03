import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [showLogin, setShowLogin] = useState(false)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [user, setUser] = useState(null)

    const [credit, setCredit] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate()

    const loadCreditsData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/credits', { headers: { token } })
            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const updateUserData = (newUserData) => {
        setUser(prev => ({ ...prev, ...newUserData }))
    }

    const generateImage = async (prompt, format = 'png', resolution = 'original') => {
        try {

            const { data } = await axios.post(backendUrl + '/api/image/generate-image', 
                { prompt, format, resolution }, 
                { headers: { token } }
            )

            if (data.success) {
                loadCreditsData()
                return {
                    image: data.resultImage,
                    historyId: data.historyId
                }
            } else {
                toast.error(data.message)
                loadCreditsData()
                if (data.creditBalance === 0) {
                    navigate('/buy')
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
        navigate('/')
    }

    useEffect(()=>{
        if (token) {
            loadCreditsData()
        }
    },[token])

    const value = {
        token, setToken,
        user, setUser,
        showLogin, setShowLogin,
        credit, setCredit,
        loadCreditsData,
        updateUserData,
        backendUrl,
        generateImage,
        logout
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider