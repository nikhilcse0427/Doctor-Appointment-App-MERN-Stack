import express, { urlencoded } from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app,use(express.static("public"))



export default app