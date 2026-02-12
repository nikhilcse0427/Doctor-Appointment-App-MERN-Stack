import mongoose from 'mongoose'
import { healthcareCategoriesList } from '../constant.js'
const dailyTimeAvailabilitySchema = new mongoose.Schema({
  start: {
    type: String
  },
  end: {
    type: String
  }
}, { _id: false })

const availabiltyRangeSchema = new mongoose.Schema({
  startDate: {
    type: String
  },
  endDate: {
    type: String
  },
  excludedWeekdays: {
    type: [Number],
    default: []
  }
}, { _id: false })

const hospitalDetailSchema = new mongoose.Schema({
  name: {
    type: String
  },
  address: {
    type: String,
  },
  city: {
    type: String
  }
}, { _id: false })
const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profileImg: {
    type: String,
    default: ""
  },
  specialization: {
    type: String,
    enum: [
      "General Physician",
      "Pediatrician",
      "Cardiologist",
      "Dermatologist",
      "Gynecologist",
      "Orthopedic Surgeon",
      "Psychiatrist",
      "Neurologist",
      "Endocrinologist",
      "Gastroenterologist",
      "Pulmonologist",
      "Oncologist",
      "Urologist",
      "Ophthalmologist",
      "ENT Specialist"
    ]
  },
  category: {
    type: [String],
    enum: healthcareCategoriesList,
    required: false
  },
  qualification: {
    type: String
  },
  experience: {
    type: Number
  },
  about: {
    type: String
  },
  fees: {
    type: Number
  },
  hospitalInfo: hospitalDetailSchema,
  phoneNum: {
    type: Number
  },
  availabilityRange: availabiltyRangeSchema,
  dailyTimeRanges: { type: [dailyTimeAvailabilitySchema], default: [] },
  slotDurationInMinutes: {
    type: Number,
    default: 30
  },
  type: {
    type: String,
    default: "doctor"
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const Doctor = mongoose.model('Doctor', doctorSchema)
export default Doctor