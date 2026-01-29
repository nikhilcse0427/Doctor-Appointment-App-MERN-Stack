import AuthForm from '../../components/AuthForm.jsx'
import React from 'react'

const LoginDoctor = () => {
  return (
    <div className='flex justify-center items-center min-h-screen w-full px-4'>
      <div className='w-full max-w-md'>
        <AuthForm type="login" userRole="doctor" />
      </div>
    </div>
  )
}

export default LoginDoctor
