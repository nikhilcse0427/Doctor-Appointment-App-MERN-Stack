import React from 'react'
import AuthForm from '../components/AuthForm'

const SignupPatient = () => {
  return (
    <div>
      <AuthForm type="signup" userRole="patient" />
    </div>
  )
}

export default SignupPatient
