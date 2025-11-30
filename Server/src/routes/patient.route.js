import { Router } from "express";
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'
import { body } from "express-validator";
import validate from '../middlewares/validate.middleware.js'
import { patientDetail, patientController } from '../controllers/patient.controller.js'

const router = Router();

router.get('/me', authenticate, requireRole('patient'), patientDetail);

router.put('/onboarding/update', authenticate, requireRole('patient'),
  [
    body('name').optional().notEmpty(),
    body('phoneNumber').optional().isString(),
    body('dob').optional().isISO8601(),
    body('age').optional().isInt(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('bloodGroup').optional().isIn(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]),
    body("emergencyContact").optional().isObject(),
    body("emergencyContact.name").optional().isString().notEmpty(),
    body("emergencyContact.phone").optional().isString().notEmpty(),
    body("emergencyContact.relationship").optional().isString().notEmpty(),

    body("medicalHistory").optional().isObject(),
    body("medicalHistory.allergies").optional().isString().notEmpty(),
    body("medicalHistory.currentMedications").optional().isString().notEmpty(),
    body("medicalHistory.chronicConditions").optional().isString().notEmpty(),
  ], validate, patientController
)


export default router