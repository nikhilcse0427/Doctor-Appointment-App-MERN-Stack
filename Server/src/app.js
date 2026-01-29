import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import doctorRouter from './routes/doctor.route.js'
import patientRouter from './routes/patient.route.js'
import cors from 'cors'
import ApiError from './utils/Api_Errors.js'

const app = express()

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("public"))

app.use('/auth', authRouter)
app.use('/doctor', doctorRouter)
app.use('/patient', patientRouter)

// Error handler middleware
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    // Handle validation errors (array of errors)
    if (Array.isArray(err.message)) {
      const errorMessages = err.message.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
      return res.status(err.statusCode).json({
        success: false,
        message: errorMessages,
        errors: err.message,
      });
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Handle other errors
  console.error('Error:', err);
  return res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  })
})

export default app