import jwt from "jsonwebtoken";
import Doctor from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import ApiError from "../utils/Api_Errors.js";

module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const token = req.header('authorization').replace("Bearer ", "");
      if (!token) {
        throw new ApiError(401, "token is missing");
      }
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.auth = decode;
      if (decode.type === 'doctor') {
        req.user = await Doctor.findById(decode.id);
      } else if (decode.type === 'patient') {
        req.user = await Patient.findById(decode.id);
      }
      if (!req.user) {
        throw new ApiError(401, "User does not exist")
      }
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  },
  requireRole: role => (req, res, next) => {
    if (req.auth?.type !== role) {
      throw new ApiError(403,"Insufficient role permissions");
    next();
  }
  }
}