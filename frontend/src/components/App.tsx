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
    return preferences.map((pref:string,idx:number)=>(
      <div key={idx} className='flex justify-between items-center p-2 hover:bg-gray-100 rounded'>
        <button className='cursor-pointer text-blue-600' onClick={()=>{
          setName(pref)
          setDoListPref(false)
        }}>{pref}</button>
        <button className='text-red-500 text-xs' onClick={()=>{
          setPreferences(preferences.filter((pref2:string)=>pref2 !== pref))
          setCookie('user',{...cookies.user, preferences: preferences.filter((pref2:string)=>pref2 !== pref)}, {path: '/'})
        }}>Delete</button>
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
  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <header className='p-6 bg-white shadow-sm mb-8'>
        <h1 className='text-3xl font-bold text-center'>Environment Checker for Outdoor Sports</h1>
      </header>
      <main className='px-6 flex flex-col items-center gap-8'>
        <div className='w-full max-w-lg flex flex-col gap-2 relative'>
          <div className='flex gap-2'>
            <input className='flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none' type='text' placeholder='Enter location...' value={name} onMouseEnter={()=>setDoListPref(true)}
             onChange={(e)=>{
              setName(e.target.value)
              setSearched(false)
            }}/>
            <button className='px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition' onClick={search}>Search</button>
            <button className='px-6 py-3 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 transition' onClick={()=>{
              setCookie('user',{...cookies.user, preferences: [...(cookies.user?.preferences || []), name]}, {path: '/'})
              setPreferences([...preferences, name])
            }}>Save</button>
          </div>
          {doListPref === true && preferences.length > 0 && (
            <div className='absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg p-2 shadow-lg z-10' onMouseLeave={()=>setDoListPref(false)}>
              {listPreferences()}
            </div>
          )}
        </div>
        {searched === true && result !== null && (
          <div className='w-full max-w-6xl'>
            <h3 className='text-2xl font-semibold mb-6'>Current environment:</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              <Card label={"Location: "} val={result.name + ', ' + result.region + ', ' + result.country} iden={""} />
              <Card label={"Latitude/Longitude: "} val={result.lat + '/' + result.lon} iden={""} />
              <Card label={"Local time: "} val={result.time} iden={""} />
              <Card label={"Weather: "} val={result.weather} iden={""} />
              <Card label={"Chance of Rain: "} val={result.rainChance} iden={"%"} />
              <Card label={"Chance of Snow: "} val={result.snowChance} iden={"%"} />
              <Card label={"Actual Temperature: "} val={result.temp} iden={"°C"} />
              <Card label={"Feels like: "} val={result.feelsLikeTemp} iden={"°C"}/>
              <Card label={"Wind: "} val={`Speed: ${result.wind_speed} / Direction: ${result.wind_dir}`} iden={""} />
              <Card label={"Pressure: "} val={result.pressure_mb} iden={"Mb"} />
              <Card label={"UV Index: "} val={result.uvIndex} iden={""} />
              <Card label={"AQI Index: "} val={`${result.aqiIndex} (US) / ${result.aqiIndex2} (GB)`} iden={""} />
              <Card label={"Air Quality: "} val={result.airQuality} iden={""} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}