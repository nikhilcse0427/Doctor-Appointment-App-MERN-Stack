import Doctor from "../models/doctor.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiError from "../utils/Api_Errors.js";

const signinToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerDoctor = async (req, res, next) => {
  try {
    const { name, email, password, ...rest } = req.body;
    const existUser = await Doctor.findOne({ email });
    if (existUser) {
      throw new ApiError(409, "Doctor with this email already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdDoctor = await Doctor.create({
      name,
      email,
      password: hashedPassword,
      ...rest,
    });

    const token = signinToken(createdDoctor._id, "doctor");
    return res.status(201).json({
      success: true,
      message: "Doctor successfully registered",
      token,
      doctor: createdDoctor,
    });
  } catch (error) {
    next(new ApiError(500, error.message));
  }
};

export const loginDoctor = async (req, res, next)=>{
  try{
  const { email, password }  = req.body;
  const existDoctor = await Doctor.findOne({email});
  if(!existDoctor){
    throw new ApiError(400, "email does not exist");
  }
  const matchPassword = await bcrypt.compare(password, existDoctor.password);
  if(!matchPassword){
    throw new ApiError(401, "Invalid password enetered")
  }
  const token = signinToken(existDoctor._id, "doctor")
  return res.status(201).json({
      success: true,
      message: "Doctor successfully loggedin",
      token,
      doctor: existDoctor,
    });
  }catch(error){
    next(new ApiError(500, error.message))
  }
}