import {useState,useEffect} from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios'
import Card from './Card'
import './App.css'
export default function App(){
  const [name,setName] = useState("")
  const [lat,setLat] = useState(0)
  const [lon,setLon] = useState(0)
  const [weather,setWeather] = useState("")
  const [temp,setTemp] = useState(0)
  const [wind,setWind] = useState(0)
  const [humidity,setHumidity] = useState(0)
  const [uvIndex,setUvIndex] = useState(0)
  const [airQuality,setAirQuality] = useState(0)
  const [aqiIndex,setAqiIndex] = useState(0)
  const [cookies,setCookie] = useCookies(['user'])
  const [preferences,setPreferences] = useState(cookies.user.preferences || [])
  function loadPreferences(){
    setPreferences(cookies.user.preferences || [])
  }
  async function search(){
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}`)
    const data = await res.data
  }
  useEffect(()=>{
    loadPreferences()
  },[cookies.user.preferences])
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
        <h1>Environment Checker for Outdoor Sports</h1>
        <div>
          <h3>Location: {name}</h3>
          <input type='text' value={name} onChange={(e)=>setName(e.target.value)} />
          <button onClick={search}>Search</button>
          <button onClick={()=>{
            setCookie('user',{...cookies.user, preferences: [...cookies.user.preferences, name]}, {path: '/'})
          }}>Save</button>
        </div>
        {name.length > 0 && (
          <div>
            <h3>Current environment: </h3>
            <div className='grid grid-cols-3'>
              <Card label={"Location: "} val={name} iden={""}/>
              <Card label={"Latitude/Longitude: "} val={String(lat) + '\n' + String(lon)} iden={""} />
              <Card label={"Humidity: "} val={humidity} iden={"%"}/>
              <Card label={"Temperature: "} val={temp} iden={"celc"} />
              <Card label={"UV Index: "} val={uvIndex} iden={"UV"} />
              <Card label={"AQI Index :"} val={aqiIndex} iden={"IDK"} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}