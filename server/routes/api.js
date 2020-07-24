const express = require('express')
const City = require('../model/City')
const { formatObject, 
        getCityImage,
        getCityWeatherByLatLon,
        getCityWeatherByName, getCitiesByIds,
        getCityWeatherById
      } = require('../helpers/functions')
const router = express.Router()

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

module.exports = router