import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.route.js'
import doctorRouter from './routes/doctor.route.js'
import patientRouter from './routes/patient.route.js'

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static("public"))

app.use('/api/auth', authRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/patient', patientRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  })
})

export default app