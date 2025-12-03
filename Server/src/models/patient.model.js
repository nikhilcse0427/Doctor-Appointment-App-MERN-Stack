import { timeStamp } from 'console'
import mongoose from 'mongoose'
import computeAgeFromDob from '../utils/date.js'
const emergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNum:{
    type: String,
    required: true
  },
  relationship:{
    type: String, 
    required: true
  }
},{id:false})

const medicalHistorySchema = new mongoose.Schema({
  allergies:{
    type: String, 
    default: ""
  }, 
  currentMeditation:{
    type: String, 
    default: ""
  },
  chronicCondion: {
    type: String, 
    default: ""
  }
},{id:false})

const patientSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type:String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  googleId:{
    type:String,
    unique: true,
    sparse: true
  }, 
  profileImg:{
    type:String,
    default: ""
  },
  phoneNumber:{
    type:String
  },
  dob:{
    type: Date,
  },
  age:{
    type:Number
  },
  gender:{
    type:String,
    enum: ["Male", "Female", "Others"]
  },
  bloodGroup:{
    type:String,
    enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
  },
  emergencyContact: emergencyContactSchema,
  medicalHistory: medicalHistorySchema,
  isVerified:{
    type:Boolean,
    default:false
  }
},{timestamps:true})

patientSchema.pre('save',function(next){
  if(this.dob && this.isModified('dob')){
    this.age = computeAgeFromDob(this.dob)
  }
  next()
})

const Patient = mongoose.model('Patient', patientSchema)
export {Patient}