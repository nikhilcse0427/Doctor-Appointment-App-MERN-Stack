import React, { useEffect } from 'react'
import './App.css'
import { useNavigate } from 'react-router-dom'
import Header from './components/landing/Header'

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
    <div className='min-h-screen'>
      <Header showDashboardNav={true} />
    </div>
  )
}

export default App