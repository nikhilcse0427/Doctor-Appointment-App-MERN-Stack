import React, { useEffect } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom'
import Header from './components/landing/Header'
import LandingHero from './components/landing/LandingHero'
import Testimonial from './components/landing/Testimonial'
import FaqSection from './components/landing/FaqSection'
import Footer from './components/landing/Footer'
import AuthForm from './components/AuthForm'

const App = () => {

  const user = {
    type: 'patient'
  }

  const navigate = useNavigate()

  useEffect(() => {
    if (user.type == 'doctor') {
      navigate('/doctor/dashboard')
    }
  }, [user, navigate])

  if (user.type == 'doctor') {
    return null
  }
  return (
    <div className='min-h-screen mx-7'>
      <Header showDashboardNav={true} />
      <main className="pt-16">
        <AuthForm />
        <LandingHero />
        <Testimonial />
        <FaqSection />
        <Footer />
      </main>
    </div>
  )
}

export default App