import Appointment from "../models/appointment.js";
import { Patient } from "../models/patient.model.js";
import ApiError from "../utils/Api_Errors.js";

// Doctor appointments
export const doctorAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { doctorId: req.auth.id };

    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArray };
    }

    const appointment = await Appointment.find(filter)
      .populate("patientId", "name email phone dob age profileImage")
      .populate("doctorId", "name fees phone specialization profileImage hospitalInfo")
      .sort({ slotStartIso: 1, slotEndIso: 1 });

    return res.status(200).json({
      success: true,
      message: "Appointment fetched successfully",
      data: appointment
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


//Patient Appointments
export const patientAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { patientId: req.auth.id };

    if (status) {
      const statusArray = Array.isArray(status) ? status : [status];
      filter.status = { $in: statusArray };
    }
    const appointments = await Appointment.find(filter)
      .populate(
        "doctorId",
        "name fees phoneNum specialization hospitalInfo profileImg"
      )
      .populate("patientId", "name email profileImg")
      .sort({ slotStartIso: 1, slotEndIso: 1 });

    return res.status(200).json({
      success: true,
      message: "Patient appointments fetched successfully",
      data: appointments,
    })

  } catch (error) {
    res.status(200).json({
      success: false,
      message: error.message,
    });
  }
  next(error);
}
