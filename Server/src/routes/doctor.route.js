import { Router } from 'express'
import { query, body } from 'express-validator'
import { authenticate, requireRole } from '../middlewares/auth.middleware.js'
import Doctor from '../models/doctor.model.js'
import validate from '../middlewares/validate.middleware.js'
import { updatDoctorProfile, searchDoctor } from '../controllers/doctor.controller.js'

const router = Router()

router.get('/list',
  [
    query("search").optional().isString(),
    query('specialization').optional().isString(),
    query('city').optional().isString(),
    query('category').optional().isString(),
    query('minFees').optional().isInt({ min: 0 }),
    query('maxFees').optional().isInt({ min: 0 }),
    query('sortBy').optional().isIn(["fees", "name", "experience", "createdAt"]),
    query('sortOrder').optional().isIn(["asc", "desc"]),
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ], validate, searchDoctor
)

//Get Doctor profile
router.get('/me', authenticate, requireRole('doctor'), async (req, res) => {
  const doctor = await Doctor.findById(req.user._id).select(-password, -googleId);
  res.status(200).json({
    success: true,
    message: "Dictor  profile fetch successfully"
  })
})

// update Doctor Profile

router.put('/onboarding/update', authenticate, requireRole('doctor'),
  [
    body('name').optional().notEmpty(),
    body('specialization').optional().notEmpty(),
    body('qualification').optional().notEmpty(),
    body('category').optional().notEmpty(),
    body('experience').optional().isInt({ min: 0 }),
    body('about').optional().isString(),
    body('fees').optional().isInt({ min: 0 }),
    body('hospitalInfo').optional().isObject(),
    body('availabilityRange.startDate').optional().isISO8601(),
    body('availabilityRange.endDate').optional().isISO8601(),
    body('availabilityRange.excludedWeekdays').optional().isArray(),
    body('dailyTimeRanges').isArray({ min: 1 }),
    body('dailyTimeRanges.*.start').isString(),
    body('dailyTimeRange.*.end').isString(),
    body('slotDurationInMinutes').optional().isInt({ min: 5, max: 180 })
  ], validate, updatDoctorProfile
)

router.get('/dashboard', authenticate, requireRole('doctor'),)





export default router
