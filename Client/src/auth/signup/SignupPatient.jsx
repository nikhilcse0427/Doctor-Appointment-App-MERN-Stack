import React from 'react'
import AuthForm from '../../components/AuthForm.jsx'

const SignupPatient = () => {
  return (
    <div className='flex justify-center items-center min-h-screen w-full px-4'>
      <div className='w-full max-w-md'>
        <AuthForm type="signup" userRole="patient" />
      </div>
    </div>
  )
}

export default SignupPatient
