import React from 'react'
import AuthForm from '../components/AuthForm'

const SignupDoctor = () => {
  return (
    <div>
      <AuthForm type='doctor' userRole="signup" />
    </div>
  )
}

export default SignupDoctor
