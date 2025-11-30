import AuthForm from '../components/AuthForm'
import React from 'react'

const LoginDoctor = () => {
  return (
    <div>
      <AuthForm type="login" userRole="doctor" />
    </div>
  )
}

export default LoginDoctor
