const computeAgeFromDob = (dob)=>{
  if(!dob) return null
  const today = new Date()
  const dobDate = new Date(dob)

  let age = today.getFullYear - dobDate.getFullYear
  let monthDiff = today.getMonth - dobDate.getMonth
  let dayDiff = today.getDate() - dobDate.getDate

  if(monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)){
    age--;
  }
  return age
}

return {computeAgeFromDob}