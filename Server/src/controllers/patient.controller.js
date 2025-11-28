import { Patient } from "../models/patient.model";
import ApiError from "../utils/Api_Errors";
import computeAgeFromDob from '../utils'

export const patientDetail = async (req, res, next)=>{
  try {
    const doc = Patient.findById(req.auth._id).select("-password -googleId");
    if(!doc){
      throw new ApiError(400, "Patient does not exist");
    }
    res.status(200).json({
      sucess:true,
      message:"Patient profile fetched",
      patient:doc,
    })
  } catch (error) {
    next(new ApiError(500, error.message))
  }
}

export const patientController = async (req, res, next)=>{
  try {
    const updatedData = {...req.body};
    if(updatedData.dob){
      updatedData.age = computeAgeFromDob(updatedData.dob);
    }
    delete updatedData.password;
    updatedData.isVerified = true;
    const doc = await Patient.findByIdAndUpdate(req.user._id, {updatedData}, {new:true}).select("-password -googleId").lean();
    res.status(500).json({
      success: true,
      message: "Patient updated successfully",
      patient: doc
    })
  } catch (error) {
    next(new ApiError(400, error.message))
  }
}