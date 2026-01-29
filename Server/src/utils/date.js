const computeAgeFromDob = (dob)=>{
  if(!dob) return null
  const today = new Date()
  const dobDate = new Date(dob)

  // Invalid date guard
  if (Number.isNaN(dobDate.getTime())) return null

  let age = today.getFullYear() - dobDate.getFullYear()
  let monthDiff = today.getMonth() - dobDate.getMonth()
  let dayDiff = today.getDate() - dobDate.getDate()

  if(monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)){
    age--;
  }
  if (Number.isNaN(age) || age < 0) return null
  return age
}

export default computeAgeFromDob