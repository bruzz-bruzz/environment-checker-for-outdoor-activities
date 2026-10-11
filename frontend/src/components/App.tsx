import {useState,useEffect} from 'react'
import {useCookies} from 'react-cookie'
import axios from 'axios'
import Card from './Card'
import './App.css'
export default function App(){
  type Cookie = {
    saved:string[]
  }
  const [name,setName] = useState("")
  const [cookies,setCookie] = useCookies(['user'])
  const [preferences,setPreferences] = useState<string[]>(cookies.user?.preferences || [])
  const [result,setResult] = useState<null | any>(null)
  const [searched,setSearched] = useState(false)
  const [doListPref,setDoListPref] = useState(false)
  function listPreferences(){
    console.log("B")
    return preferences.map((pref:string,idx:number)=>(
      <div key={idx} onMouseEnter={()=>setDoListPref(true)} onMouseLeave={()=>setDoListPref(false)}>
        <button className='cursor-pointer' onClick={()=>{
          setName(pref)
          setDoListPref(false)
          console.log(name)
        }}>{pref}</button>
        <button onClick={()=>{
          setPreferences(preferences.filter((pref2:string)=>pref2 !== pref))
          setCookie('user',{...cookies.user, preferences: preferences.filter((pref2:string)=>pref2 !== pref)}, {path: '/'})
        }}>del</button>
      </div>
    ))
  }
  async function search(){
    if(name.length > 0){
      setSearched(true)
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}`,{
          location:name
      })
      setResult(res.data)
    }
  }
  useEffect(()=>{
    console.log(doListPref)
  })
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
        <h1>Environment Checker for Outdoor Sports</h1>
        <div>
          <h3>Location: {name}</h3>
          <input type='text' value={name} onMouseEnter={()=>setDoListPref(true)}
           onChange={(e)=>{
            setName(e.target.value)
            setSearched(false)
          }}/>
          {doListPref === true && preferences.length > 0 && (
            <div className='absolute bg-white border border-black rounded-lg p-2'>
              {listPreferences()}
            </div>
          )}
          <button onClick={search}>Search</button>
          <br/>
          <button onClick={()=>{
            setCookie('user',{...cookies.user, preferences: [...(cookies.user?.preferences || []), name]}, {path: '/'})
            setPreferences([...preferences, name])
          }}>Save</button>
        </div>
        {searched === true && result !== null && (
          <div>
            <h3>Current environment: </h3>
            <div className='grid grid-cols-3'>
              <Card label={"Location: "} val={result.name + ', ' + result.region + ', ' + result.country} iden={""} />
              <Card label={"Latitude/Longitude: "} val={result.lat + '/' + result.lon} iden={""} />
              <Card label={"Local time: "} val={result.time} iden={""} />
              <Card label={"Weather: "} val={result.weather} iden={""} />
              <Card label={"Chance of Rain: "} val={result.rainChance} iden={"%"} />
              <Card label={"Chance of Snow: "} val={result.snowChance} iden={"%"} />
              <Card label={"Actual Temperature: "} val={result.temp} iden={"°C"} />
              <Card label={"Feels like: "} val={result.feelsLikeTemp} iden={"°C"}/>
              <Card label={"Wind: "} val={`Speed: ${result.wind_speed}\nDegree: ${result.wind_degree}\nDirection:${result.wind_dir}`} iden={""} />
              <Card label={"Pressure: "} val={result.pressure_mb} iden={"Mb"} />
              <Card label={"UV Index: "} val={result.uvIndex} iden={""} />
              <Card label={"AQI Index: "} val={`${result.aqiIndex} (US-EPA-INDEX) / ${result.aqiIndex2} (GB-DEGRA-INDEX)`} iden={""} />
              <Card label={"Air Quality: "} val={result.airQuality} iden={""} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}