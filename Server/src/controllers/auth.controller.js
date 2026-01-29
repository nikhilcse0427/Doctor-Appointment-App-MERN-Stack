import Doctor from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
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
      data: {
        token,
        user: createdDoctor,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const loginDoctor = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existDoctor = await Doctor.findOne({ email });
    if (!existDoctor) {
      throw new ApiError(400, "Email does not exist");
    }
    const matchPassword = await bcrypt.compare(password, existDoctor.password);
    if (!matchPassword) {
      throw new ApiError(401, "Invalid password entered");
    }
    const token = signinToken(existDoctor._id, "doctor");
    return res.status(200).json({
      success: true,
      message: "Doctor successfully logged in",
      data: {
        token,
        user: existDoctor,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const registerPatient = async (req, res, next) => {
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
      data: {
        token,
        user: createdPatient,
      },
    });

  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
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
      data: {
        token,
        user: existPatient,
      },
    });

  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};
