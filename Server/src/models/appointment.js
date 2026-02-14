import mongoose from 'mongoose'
const appointmentSchema = new mongoose.Schema({
  doctorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Doctor",
    required:true
  },
  patientId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:doctor,
    required:true
  },
  date:{
    type:Date,
    required:true
  },
  slotStartIso:{
    type:String,
    required:true
  },
  slotEndIso:{
    type:String,
    required:true
  },
  consultationType:{
    type:String,
    enum:["Video Consultation", "Voice Consultation"],
    default: "Video Calling"
  },
  status:{
    type:String,
    enum:["Scheduled", "Completed", "Pending", "In Progress"],
    required: true
  },
  symptoms:{
    type:String,
    required: true
  },
  zegoRoomId:{type:String,default:''},
  prescription:{type:String,default:''},
  notes:{type:String,default:''},
  consultationFees:{type:Number,required: true },
  platformFees:{type:Number,required: true},
  totalAmount:{type:Number,required: true},
  paymentStatus: {
    type:String,
    enum: ['Pending','Paid','refunded'],
    default:'Pending'
  },
  payoutStatus: {
    type:String,
    enum: ['Pending','Paid','Cancelled'],
    default:'Pending'
    },

    payoutDate:{type:Date},
    paymentMethod: {type:String,default:'Online'},

    razorpayOrderId: {type:String},
    razorpayPaymentId: {type:String},
    razorpaySignature: {type:String},
    paymentDate:{type:Date}

}, {timestamps:true});

appointmentSchema.index({doctorId:1,date:1,slotStartIso:1},{unique:true})

const Appointment = mongoose.model('Appointment', appointmentSchema)
export default Appointment