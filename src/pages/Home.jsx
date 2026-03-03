import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Testimonials from '../components/Testimonials'
import GenerateBtn from '../components/GenerateBtn'
import DebugUser from '../components/DebugUser'

const Home = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* <DebugUser /> */}
        <Header />
        <Steps />
        <Description />
        <Testimonials />
        <GenerateBtn />
    </div>
  )
}

export default Home