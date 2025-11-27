import {validationResult} from 'express-validator'
import  ApiError  from '../utils/Api_Errors.js'

const validate = (req, res, next)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    throw new ApiError(400, errors.array())
  }
  next()
}
export default validate

// When do we use 400?

// You send a 400 Bad Request when:

// ❌ User sends wrong data

// Example:
// email is not valid
// password too short
// required field missing
