import Doctor from "../models/doctor.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiError from "../utils/Api_Errors.js";

const signinToken = (id, type) => {
  return jwt.sign({ id, type }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerDoctor = async (req, res) => {
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

export const loginDoctor = async (req, res)=>{
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

export const registerPatient = async (req, res) => {
  try {
    const { name, email, password, ...rest } = req.body;

    const existUser = await Patient.findOne({ email });
    if (existUser) {
      throw new ApiError(409, "Patient with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdPatient = await Patient.create({
      name,
      email,
      password: hashedPassword,
      ...rest,
    });

    const token = signinToken(createdPatient._id, "patient");

    return res.status(201).json({
      success: true,
      message: "Patient successfully registered",
      token,
      patient: createdPatient,
    });

  } catch (error) {
    next(error);
  }
};


export const loginPatient = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existPatient = await Patient.findOne({ email });
    if (!existPatient) {
      throw new ApiError(400, "Email does not exist");
    }

    const matchPassword = await bcrypt.compare(password, existPatient.password);
    if (!matchPassword) {
      throw new ApiError(401, "Invalid password entered");
    }

    const token = signinToken(existPatient._id, "patient");

    return res.status(200).json({
      success: true,
      message: "Patient successfully logged in",
      token,
      patient: existPatient,
    });

  } catch (error) {
    next(error);
  }
};
