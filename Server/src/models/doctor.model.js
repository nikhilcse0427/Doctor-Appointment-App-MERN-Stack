import mongoose from 'mongoose'
import {healthcareCategoriesList} from '../constant.js'
const dailyTimeAvailabilitySchema = new mongoose.Schema({
  start:{
    type:String
  },
  end:{
    type:String
  }
},{_id:false})

const availabiltyRangeSchema = new mongoose.Schema({
  startDate:{
    type:String
  },
  endDate:{
    type:String
  },
  excludedWeekDays:{
    type:Number,
    default: []
  }
},{_id:false})

const hospitalDetailSchema = new mongoose.Schema({
  name:{
    type:String
  },
  address:{
    type:String,
  },
  city:{
    type:String
  }
},{_id:false})
const doctorSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  googleId:{
    type:String,
    unique:true,
    sparse:true
  },
  profileImg:{
    type:String,
    default:""
  },
  specialisation:{
    type:String,
    enum: ["Cardiologist", "Dertemologist", "Oethopedic", "permiadictrician", "Neurologist", "gercimologist", "General Physians", "ETN Specialist", "Physichrist", "Optheomologist"]
  },
  category:{
    type:String,
    enum:healthcareCategoriesList,
    required:false
  },
  qualification:{
    type:String
  },
  experience:{
    type:Number
  },
  about:{
    type:String
  },
  fees:{
    type:Number
  },
  hospitalInfo: hospitalDetailSchema,
  phoneNum:{
    type:Number
  }, 
  availabiltyRange: dailyTimeAvailabilitySchema,
  dailyTimeAvailability: dailyTimeAvailabilitySchema,
  slotDuration:{
    type:Number,
    default:30
  },
  isVerified:{
    type:Boolean,
    default:false
  }
},{timestamps:true})

const Doctor = mongoose.model('Doctor', doctorSchema)
export default Doctor