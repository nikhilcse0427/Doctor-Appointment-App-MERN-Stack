import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'
import { connectDB } from './config/db.js'

const port = process.env.PORT || 8000

connectDB()
.then(
  app.listen(port, ()=>{
    console.log(`app is running on port ${port}`)
  })
)
.catch((error)=>{
  console.log("Error", error)
})

