import { Router } from "express";
import { body } from "express-validator";
import validate from "../middlewares/validate.middleware.js";
import { registerDoctor } from '../controllers/auth.controller.js'
const router = Router()

router.post('/register/doctor', [
  body('name').notEmpty().isLength({ min: 5 }).withMessage("Invalid name field"),
  body('email').notEmpty().isEmail().withMessage("Imvalid email field"),
  body('password').isLength({ min: 6 }).withMessage("Length of password must be atleast 6 character long.")
], validate, registerDoctor)

export default router