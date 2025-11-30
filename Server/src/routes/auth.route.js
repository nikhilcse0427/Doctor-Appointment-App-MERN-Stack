import { Router } from "express";
import { body } from "express-validator";
import validate from "../middlewares/validate.middleware.js";
import { registerDoctor, loginDoctor, registerPatient, loginPatient } from '../controllers/auth.controller.js'
const router = Router()

router.post('/register/doctor', [
  body('name').notEmpty().isLength({ min: 5 }).withMessage("Invalid name field"),
  body('email').notEmpty().isEmail().withMessage("Imvalid email field"),
  body('password').isLength({ min: 6 }).withMessage("Length of password must be atleast 6 character long.")
], validate, registerDoctor)

router.post('/login/doctor', [
  body('email').notEmpty().isEmail().withMessage("Invalid email entered"),
  body('password').isLength({ min: 6 })
], validate, loginDoctor)

router.post('/register/patient', [
  body('name').notEmpty().isLength({ min: 5 }).withMessage("Invalid name field"),
  body('email').notEmpty().isEmail().withMessage("Imvalid email field"),
  body('password').isLength({ min: 6 }).withMessage("Length of password must be atleast 6 character long.")
], validate, registerPatient)

router.post('/login/patient', [
  body('email').notEmpty().isEmail().withMessage("Invalid email entered"),
  body('password').isLength({ min: 6 })
], validate, loginPatient)

export default router