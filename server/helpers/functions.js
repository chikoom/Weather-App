const axios = require('axios')
const City = require('../model/City')

const API_KEY = process.env.WEATHER_API_KEY || ''
const API_URL = process.env.WEATHER_URL || ''
const IMAGE_KEY = process.env.IMAGES_API_KEY || ''
const IMAGE_URL = process.env.IMAGES_URL || ''

const checkLastUpdatedAndRefresh = async (citiesData) => {
  const timeNow = new Date()
  let citiesIdsToUpdate = citiesData.filter(city => ((timeNow - city.lastUpdate)/1000/60) > 30)
                                    .map(city => city.cityId)
                                    .join(',')
  let newCities = ''
  if(citiesIdsToUpdate.length > 0)
    newCities = await getCitiesByIds(citiesIdsToUpdate)
}

const getCityWeatherById = async (cityId) => {
  let response = await axios.get(`${API_URL}/weather`,{params:{
    units:'metric',
    appid: API_KEY,
    id:cityId
  }})
  return response.data
}

const getCitiesByIds = async (idsArray) => {
  let response = await axios.get(`${API_URL}/group`, {params:{
    id:idsArray,
    units:'metric',
    appid: API_KEY
  }})
  const promiseArray = []
  response.data.list.forEach(city => {
  const formatedRes = formatObject(city)
  promiseArray.push(
  City.findOneAndUpdate(
  {cityId:city.id},
  {$set:formatedRes},
  {useFindAndModify:false, new: true})
  .exec())})
  return Promise.all(promiseArray)
}

const getCityWeatherByName = async (cityName) => {
  let response = await axios.get(`${API_URL}/weather`,{params:{
    units:'metric',
    appid: API_KEY,
    q:cityName
  }})
  return response.data
}

const getCityWeatherByLatLon = async (lat, lon) => {
  let response = await axios.get(`${API_URL}/weather`, {params:{
    units:'metric',
    appid: API_KEY,
    lat,lon
  }})
  return response.data
}

const getCityImage = async (cityName) => {
  try{
    let response = await axios.get(`${IMAGE_URL}`,{params:{
                                                    per_page:1,
                                                    page:1,
                                                    client_id:IMAGE_KEY,
                                                    query:cityName
                                                  }})
    const imageURL = response.data.results[0].urls.regular
    return imageURL
  } catch (err) {
    return ''
  }
}

const formatObject = (data, cityImage = null) => {
  const cityObjectToReturn = {
    cityId:data.id,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    name: data.name,
    icon: data.weather[0].icon,
    condition: data.weather[0].description,
    lastUpdate: new Date()
  }
  if (cityImage) cityObjectToReturn.cityImage = cityImage
  return cityObjectToReturn
}

module.exports = {
  formatObject,
  getCityImage,
  getCityWeatherByLatLon,
  getCityWeatherByName,
  getCitiesByIds,
  getCityWeatherById,
  checkLastUpdatedAndRefresh
}