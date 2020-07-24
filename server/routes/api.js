const express = require('express')
const axios = require('axios')
const City = require('../model/City')
const router = express.Router()
const API_KEY = process.env.WEATHER_API_KEY || ''
const API_URL = process.env.WEATHER_URL || ''
const IMAGE_KEY = process.env.IMAGES_API_KEY || ''
const IMAGE_URL = process.env.IMAGES_URL || ''

router.get('/sanity', (req,res) => {
  res.send('OK')
})

router.get('/city/:cityName', async (req,res) => {
  const {cityName} = req.params
  try {
    let cityWeather = await getCityWeatherByName(cityName)                                                           
    let cityImage = await getCityImage(cityName)
    let formatedObject = formatObject(cityWeather, cityImage)
    res.send(formatedObject)
  } catch(err) {
    console.error(err)
    res.status(500)
    res.send({error: "Error recieving city data"})
  }
})

router.get('/city/:lat/:lon', async (req,res) => {
  const {lat, lon} = req.params
  try {
    let cityWeather = await getCityWeatherByLatLon(lat, lon) 
    let cityImage = await getCityImage(cityWeather.name)
    let formatedObject = formatObject(cityWeather,cityImage)
    res.send(formatedObject)
  } catch(err) {
    console.error(err)
    res.status(500)
    res.send({error: "Error recieving city by location data"})
  }
})

router.post('/city', async (req, res) => {
  const {name, temp, condition, feelsLike, icon, cityId, lastUpdate, cityImage} = req.body
  try {
    const cityToSave = new City({name, temp, condition, feelsLike, icon, cityId, lastUpdate, cityImage})
    const response = await cityToSave.save()
    res.send(response)
  } catch(err) {
    console.error(err)
    res.status(500)
    res.send({error: "Error Saving City"})
  }
})

router.get('/cities', async (req,res) => {
  try {
    let response = await City.find({}).exec()
    res.send(response)
  } catch(err) {
    console.error(err)
    res.status(500)
    res.send({error: "Error Getting cities from DB"})
  }
})

router.delete('/city/:cityId', async (req,res) => {
  const {cityId} = req.params
  try {
    let response = await City.findOneAndDelete({_id:cityId}).exec()
    res.send(response)
  } catch(err) {
    console.error(err)
    res.status(500)
    res.send({error: "Error deleting city from DB"})
  }
})

router.put('/updateCity', async (req, res) => {
  const allCities = await City.find({}).exec()
  let citiesIds = allCities.map(city => city.cityId).join(',')
  getCitiesByIds(citiesIds)
  .then(data => res.send(data))
  .catch(err => {
    console.error(err)
    res.status(500)
    res.send({error: "Error updating cities"})
  })
})

router.put('/updateCity/:cityId', async (req, res) => {
  const cityToUpdate = await City.find({_id:req.params.cityId}).exec()
  try {
    let response = await getCityWeatherById(cityToUpdate[0].cityId)
    const formatedRes = formatObject(response)
    const savedItem = await City.findOneAndUpdate({cityId:formatedRes.cityId},
                                                  {$set:formatedRes},
                                                  {useFindAndModify:false,new: true})
                                                  .exec()
    res.send(savedItem)
  } catch (err) {
    console.error(err)
    res.status(500)
    res.send({error: "Error updating city"})
  }
})

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

module.exports = router