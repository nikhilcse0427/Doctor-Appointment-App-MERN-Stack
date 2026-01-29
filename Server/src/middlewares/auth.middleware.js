import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import ApiError from "../utils/Api_Errors.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, "Token is missing");
    }

    const token = authHeader.replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decode;

    if (decode.type === 'doctor') {
      req.user = await Doctor.findById(decode.id);
    } else if (decode.type === 'patient') {
      req.user = await Patient.findById(decode.id);
    }

    if (!req.user) {
      throw new ApiError(401, "User does not exist");
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  try {
    if (req.auth?.type !== role) {
      throw new ApiError(403, "Insufficient role permissions");
    }
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
};