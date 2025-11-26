import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { healthcareCategories } from '@/lib/constants'

const LandingHero = () => {
  return (
    <div className='bg-[#d8e4ff]'>
    <section className="py-10 px-4 rounded mt-7">
      <div className='px-20 py-10'>
        <h1 className='text-center font-bold sm: md:leading-tight py-2 text-5xl'>A place where care meets convenience<br />
        <span className='text-blue-800'>Your health, our priority — always</span></h1>
        <p className='md:text-xl font-semibold text-gray-600 p-2 text-center py-4'>
          Quality consultations, available 24/7 — with or without insurance, right when you need them.
         <br />
          Connect instantly with trusted doctors for expert care.
        </p>
      </div>
      <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
        <Button  outline='ghost' className='bg-blue-700 p-7 text-2xl hover:bg-black '>Book a video visit</Button>
        <Link to='/login/patient'>
        <Button outline='ghost' className='bg-blue-700 w-full p-7 text-2xl hover:bg-black'>Login as Doctor</Button>
        </Link>
      </div>
    </section>

    {/* {HealthcareCategories} */}
    <section>
  <div className="flex flex-row justify-center items-center overflow-x-auto gap-4 scrollbar-hide mt-[-50px] px-4">
    {healthcareCategories.map((category, idx) => (
      <Button
        key={idx}
        variant="none"
        className="flex flex-col gap-3 justify-center items-center h-20"
      >
        <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center`}>
          <svg
            className="w-7 h-7 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
          >
            <path d={category.icon} />
          </svg>
        </div>

        <span className="text-xs font-medium text-blue-900 text-center leading-tight">
          {category.title}
        </span>
      </Button>
    ))}
  </div>
</section>

    <div className='flex flex-wrap justify-center gap-5 text-gray-60 mt-6  pb-12'>
      <div className='flex justify-row items-center gap-2'>
        <div className='bg-green-300 rounded-full w-2 h-2'></div>
        <span>500+ Certified Doctors</span>
      </div>
      <div className='flex justify-row items-center gap-2'>
        <div className='bg-green-300 rounded-full w-2 h-2'></div>
        <span>0,000+ Satisfied Patients</span>
      </div>
      <div className='flex justify-row items-center gap-2'>
        <div className='bg-green-300 rounded-full w-2 h-2'></div>
        <span>24/7 Availability</span>
      </div>
    </div>

    </div>
  )
}

export default LandingHero
