import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Header from './components/landing/Header'
import LandingHero from './components/landing/LandingHero'
import Testimonial from './components/landing/Testimonial'
import FaqSection from './components/landing/FaqSection'
import Footer from './components/landing/Footer'

// Auth components
import LoginPatient from './auth/login/LoginPatient'
import LoginDoctor from './auth/login/LoginDoctor'
import SignupPatient from './auth/signup/SignupPatient'
import SignupDoctor from './auth/signup/SignupDoctor'

// Onboarding components
import PatientOnboardingForm from './components/patient/PatientOnboardingForm'
import DoctorOnboardingForm from './components/doctor/DoctorOnboardingForm'

// Landing Page Component
const LandingPage = () => {
  return (
    <div className='min-h-screen mx-7'>
      <Header showDashboardNav={false} />
      <main className="pt-16">
        <LandingHero />
        <Testimonial />
        <FaqSection />
        <Footer />
      </main>
    </div>
  )
}

// Real Dashboard components
import PatientDashboard from './dashboard/PatientDashboard'
import DoctorDashboard from './dashboard/DoctorDashboard'
const DoctorAppointments = () => <div>Doctor Appointments Placeholder</div> // Until I find or create this component

const App = () => {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth Routes */}
      <Route path="/login/patient" element={<LoginPatient />} />
      <Route path="/login/doctor" element={<LoginDoctor />} />
      <Route path="/signup/patient" element={<SignupPatient />} />
      <Route path="/signup/doctor" element={<SignupDoctor />} />

      {/* Onboarding Routes */}
      <Route path="/onboarding/patient" element={<PatientOnboardingForm />} />
      <Route path="/onboarding/doctor" element={<DoctorOnboardingForm />} />

      {/* Patient Routes */}
      <Route path="/patient/dashboard" element={<PatientDashboard />} />

      {/* Doctor Routes */}
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/appointment" element={<DoctorAppointments />} />
    </Routes>
  )
}

export default App