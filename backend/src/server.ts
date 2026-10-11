import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import axios from 'axios'
import rateLimit from 'express-rate-limit'
import {body,validationResult} from 'express-validator'
dotenv.config()
const app = express()
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
})
app.use(helmet())
app.use(limiter)
console.log(process.env.ORIGIN)
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}))
app.use(express.json())
app.post('/',[body("location").trim().notEmpty()],async (req:express.Request,res:express.Response)=>{
    const errs = validationResult(req)
    if(!errs.isEmpty()){
        return res.status(400).json({errors:errs.array()})
    }
    const weatherRes = await axios.get(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&q=${req.body.location}&aqi=yes`)
    let returnData = {
        name:weatherRes.data.location.name,
        region:weatherRes.data.location.region,
        country:weatherRes.data.location.country,
        lat:weatherRes.data.location.lat,
        lon:weatherRes.data.location.lon,   
        time:weatherRes.data.location.localtime,
        weather:weatherRes.data.current.condition.text,
        temp:weatherRes.data.current.temp_c,
        wind_speed:weatherRes.data.current.wind_kph,
        wind_degree:weatherRes.data.current.wind_degree,
        wind_dir:weatherRes.data.current.wind_dir,
        pressure_mb:weatherRes.data.current.pressure_mb,
        humidity:weatherRes.data.current.humidity,
        feelsLikeTemp:weatherRes.data.current.feelslike_c,
        uvIndex:weatherRes.data.current.uv,
        airQuality:weatherRes.data.current.air_quality,
        aqiIndex:weatherRes.data.current.air_quality['us-epa-index'],
        aqiIndex2:weatherRes.data.current.air_quality['gb-defra-index'],
        rainChance:weatherRes.data.forecast.forecastday[0].day.daily_chance_of_rain,
        snowChance:weatherRes.data.forecast.forecastday[0].day.daily_chance_of_snow,
    }
    return res.status(200).json(returnData)
})
app.listen(3000,()=>{
    console.log('Server is running on port 3000')
})