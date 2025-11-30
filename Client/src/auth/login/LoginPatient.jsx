import React from 'react'
import AuthForm from '../components/AuthForm'

const LoginPatient = () => {
  return (
    <div>
      <AuthForm type="login" userRole="Patient" />
    </div>
  )
}

export default LoginPatient
