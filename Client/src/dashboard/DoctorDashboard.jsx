import React, { Suspense, lazy } from "react"
import Loader from '@/components/Loader'

const DoctorDashboardContent = lazy(() => import("@/onboarding/DoctorDashboardContent.jsx"))

const DoctorDashboard = () => {
  return (
    <Suspense fallback={<Loader />}>
      <DoctorDashboardContent />
    </Suspense>
  )
}

export default DoctorDashboard