import React from 'react'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { healthcareCategories } from '@/lib/constants'

const LandingHero = () => {
  const navigate = useNavigate()
  return (
    <div className='bg-[#d8e4ff]'>
      <section className="py-6 sm:py-10 px-4 rounded mt-7">
        <div className='px-4 sm:px-10 md:px-20 py-6 sm:py-10'>
          <h1 className='text-center font-bold leading-tight py-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>A place where care meets convenience<br />
            <span className='text-blue-800'>Your health, our priority — always</span></h1>
          <p className='text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-600 p-2 text-center py-4'>
            Quality consultations, available 24/7 — with or without insurance, right when you need them.
            <br />
            Connect instantly with trusted doctors for expert care.
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4'>
          <Button outline='ghost' className='bg-blue-700 px-4 py-3 sm:px-6 sm:py-4 md:p-7 text-base sm:text-lg md:text-xl lg:text-2xl hover:bg-black w-full sm:w-auto'
            onClick={() => navigate('/login/patient')}
          >Book a video visit</Button>
          <Link to='/login/doctor' className='w-full sm:w-auto'>
            <Button outline='ghost' className='bg-blue-700 w-full px-4 py-3 sm:px-6 sm:py-4 md:p-7 text-base sm:text-lg md:text-xl lg:text-2xl hover:bg-black'>Login as Doctor</Button>
          </Link>
        </div>
      </section>

      {/* {HealthcareCategories} */}
      <section>
        <div className="flex flex-row justify-center items-center overflow-x-auto gap-2 sm:gap-4 scrollbar-hide mt-[-30px] sm:mt-[-50px] px-2 sm:px-4 pb-2">
          {healthcareCategories.map((category, idx) => (
            <Button
              key={idx}
              variant="none"
              className="flex flex-col gap-2 sm:gap-3 justify-center items-center h-16 sm:h-20 min-w-[60px] sm:min-w-[80px]"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${category.color} rounded-xl sm:rounded-2xl flex items-center justify-center`}>
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path d={category.icon} />
                </svg>
              </div>

              <span className="text-[10px] sm:text-xs font-medium text-blue-900 text-center leading-tight px-1">
                {category.title}
              </span>
            </Button>
          ))}
        </div>
      </section>

      <div className='flex flex-wrap justify-center gap-3 sm:gap-5 text-gray-600 mt-4 sm:mt-6 pb-8 sm:pb-12 px-4'>
        <div className='flex flex-row items-center gap-2'>
          <div className='bg-green-300 rounded-full w-2 h-2 shrink-0'></div>
          <span className='text-xs sm:text-sm md:text-base'>500+ Certified Doctors</span>
        </div>
        <div className='flex flex-row items-center gap-2'>
          <div className='bg-green-300 rounded-full w-2 h-2 shrink-0'></div>
          <span className='text-xs sm:text-sm md:text-base'>0,000+ Satisfied Patients</span>
        </div>
        <div className='flex flex-row items-center gap-2'>
          <div className='bg-green-300 rounded-full w-2 h-2 shrink-0'></div>
          <span className='text-xs sm:text-sm md:text-base'>24/7 Availability</span>
        </div>
      </div>

    </div>
  )
}

export default LandingHero
