import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI)
    const connectInstance = await mongoose.connect(process.env.MONGODB_URI)
    console.log("Mongodb connected successfully ✅")

  } catch (error) {
    console.log("MONGODB Connection failed ❌")
    process.exit(1)
  }
}

export { connectDB }