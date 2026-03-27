import { Router } from "express";
import { body } from "express-validator";
import { authenticate, requireRole } from "../middlewares/auth.middleware";

const router = Router();

router.get('/doctor', authenticate, requireRole('doctor'),
  [
    query("status").optional().isArray().withMessage("Status cannot be ar array"),
    query("status.*")
      .optional()
      .isString()
      .withMessage("Each status must be string")
  ], validate,)

