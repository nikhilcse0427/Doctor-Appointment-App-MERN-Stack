import ApiError from "../utils/Api_Errors"
import {query} from 'express-validator'
const Doctor = require("../modal/Doctor");
const Appointment = require("../modal/Appointment");

export const searchDoctor = async (req, res, next)=>{
  try {
    const {search, specialization, city, category, minFees, sortBy="createdAt", sortOrder="desc",page=1, limit=20} = req.query
    const filter = { isVerified : true };
    if(specialization){
      filter.specialization = {
        $regex: `^${specialization}$`,
        $option: "i", //case insesitive
      }
    }
    if(city){
      filter["hospitalInfo.city"] = {
        $regex: city,
        $optional: "i"
      }
    }
    if(category){
      filter.category = category
    }
    if(minFees || maxFees){
      filter.fees = {};
      filter.fees.$gte = Number(minFees)
      filter.fees.$lte = Number(maxFees)
    }
    if(search){
      filter.$or = [
        { name: { $regex:search, $option: "i" } },
        {specialization: {$regex:search, $option: "i"}},
        { "hospitalInfo.name": { $regex: search, $options: "i" } },
      ]
    }
     const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };
      const skip = (Number(page) - 1) * Number(limit);
      const [items, total] = await Promise.all([
  Doctor.find(filter)
    .select("-password -googleId")
    .sort(sort)
    .skip(skip)
    .limit(Number(limit)),
  Doctor.countDocuments(filter),
]);

  } catch (error) {
    throw new ApiError(401, error.message)
  }
}

export const updatDoctorProfile = async (req, res, next)=>{
  try {
    const updatedData = {...req.body};
    delete updatedData.password;
    updatedData.isVerified= true;
    const doc = await Doctor.findByIdAndUpdate(req.user._id, updatedData, {new:true}).select("-password -googleId");
    res.status(200).json({
      "success": true,
      "message": "Doctor Profile successfully updated",
      doctor: doc
    })
  } catch (error) {
    next(new ApiError(400, error,message))
  }
}

// export const doctorDashboard = async (req, res, next)=>{
//   try {
//     const doctorId = req.auth.id;
//     const now = new Date();
//     const startOfDay = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate(),
//       0,
//       0,
//       0,
//       0
//     )
//     const endOfDay = new Date(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate(),
//       23,
//       59,
//       59,
//       999 //1sec = 1000 millisecond
//     )
//     const doctor = Doctor.findById(doctorId).select("-password -googleId").lean();

//     if(!doctor){
//       throw new ApiError(400, "Doctor not found");
//     }

//   } catch (error) {
//     next(new ApiError(400, error.message))
//   }
// }



