import { Patient } from "../models/patient.model.js";
import ApiError from "../utils/Api_Errors.js";
import computeAgeFromDob from '../utils/date.js'

export const patientDetail = async (req, res, next) => {
  try {
    const doc = Patient.findById(req.auth._id).select("-password");
    if (!doc) {
      throw new ApiError(400, "Patient does not exist");
    }
    res.status(200).json({
      sucess: true,
      message: "Patient profile fetched",
      patient: doc,
    })
  } catch (error) {
    next(new ApiError(500, error.message))
  }
}

export const patientController = async (req, res, next) => {
  try {
    const updatedData = { ...req.body };
    if (updatedData.dob) {
      const computedAge = computeAgeFromDob(updatedData.dob);
      if (computedAge === null) {
        // don't write NaN / invalid ages to DB
        delete updatedData.age;
      } else {
        updatedData.age = computedAge;
      }
    }
    delete updatedData.password;
    updatedData.isVerified = true;
    const doc = await Patient.findByIdAndUpdate(req.user._id, updatedData, { new: true }).select("-password").lean();
    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: doc
    })
  } catch (error) {
    next(new ApiError(400, error.message))
  }
}