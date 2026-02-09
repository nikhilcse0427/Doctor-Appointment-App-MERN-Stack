import React, { Suspense, lazy } from 'react'
import Loader from '@/components/Loader'

const PatientDashboardContent = lazy(() => import('@/onboarding/PatientDashboardContent'))

const PatientDashboard = () => {
  return (
    <Suspense fallback={<Loader />}>
      <PatientDashboardContent />
    </Suspense>
  )
}

export default PatientDashboard
