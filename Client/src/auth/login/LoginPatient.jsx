import React from 'react'
import AuthForm from '../../components/AuthForm.jsx'

const LoginPatient = () => {
  return (
    <div className='flex justify-center items-center min-h-screen w-full px-4'>
      <div className='w-full max-w-md'>
        <AuthForm type="login" userRole="Patient" />
      </div>
    </div>
  )
}

export default LoginPatient
