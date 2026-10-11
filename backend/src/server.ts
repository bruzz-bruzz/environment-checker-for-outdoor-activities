import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.get('/',(req:express.Request,res:express.Response)=>{
    
})
app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})