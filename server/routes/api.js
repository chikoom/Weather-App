const express = require('express')
const axios = require('axios')
const mongoose = require('mongoose')
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
  console.log(req.params.cityName)
  const {cityName} = req.params
  try{
    let response = await axios.get(`${API_URL}/weather`,{params:{units:'metric',appid: API_KEY,q:cityName}})
    let cityImage = await getCityImage(cityName)
    console.log(cityImage)
    const formatedRes = {
      cityId:response.data.id,
      temp: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      name: response.data.name,
      icon: response.data.weather[0].icon,
      condition: response.data.weather[0].description,
      lastUpdate: new Date(),
      cityImage: cityImage
    }
    res.send(formatedRes)
  }catch(err){
    console.error(err)
    res.status(500)
  }finally{
    res.end()
  }
})

router.get('/city/:lat/:lon', async (req,res) => {
  console.log(req.params)
  const {lat, lon} = req.params
  try{
    let response = await axios.get(`${API_URL}/weather`,{params:{units:'metric',appid: API_KEY,lat,lon}})
    let cityImage = await getCityImage(response.data.name)
    console.log(response)
    const formatedRes = {
      cityId:response.data.id,
      temp: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      name: response.data.name,
      icon: response.data.weather[0].icon,
      condition: response.data.weather[0].description,
      lastUpdate: new Date(),
      cityImage: cityImage
    }
    res.send(formatedRes)
  }catch(err){
    console.error(err)
    res.status(500)
  }finally{
    res.end()
  }
})

router.post('/city', async (req, res) => {
  const {name,temp,condition,feelsLike,icon,cityId,lastUpdate,cityImage} = req.body
  //validateData(req.body)
  try {
    const cityToSave = new City({name,temp,feelsLike,condition,icon,cityId,lastUpdate,cityImage})
    const response = await cityToSave.save()
    res.send(response)
  }catch(err){
    console.error(err)
    res.status(500)
  }finally{
    res.end()
  }
})

router.get('/cities', async (req,res) => {
  try{
    let response = await City.find({}).exec()
    res.send(response)
  }catch(err){
    console.error(err)
    res.status(500)
  }finally{
    res.end()
  }
})

router.delete('/city/:cityId', async (req,res) => {
  const {cityId} = req.params
  console.log(cityId)
  try{
    let response = await City.findOneAndDelete({_id:cityId}).exec()
    res.send(response)
  }catch(err){
    //console.error(err)
    res.status(500)
  }finally{
    res.end()
  }
})

router.put('/updateCity', async (req, res) => {
  const allCities = await City.find({}).exec()
  let citiesIds = allCities.map(city => city.cityId).join(',')
  try{
    let response = await axios.get(`${API_URL}/group`,{params:{id:citiesIds,units:'metric',appid: API_KEY}})
    const promiseArray = []
    response.data.list.forEach(city => {
      const formatedRes = {
        cityId:city.id,
        temp: city.main.temp,
        feelsLike: city.main.feels_like,
        name: city.name,
        icon: city.weather[0].icon,
        condition: city.weather[0].description,
        lastUpdate: new Date()
      }
      //console.log(formatedRes)
      promiseArray.push(City.findOneAndUpdate({cityId:city.id},{$set:formatedRes},{useFindAndModify:false,new: true}).exec())
    })
    Promise.all(promiseArray).then(data => {
      console.log(data)
      res.send(data)
    })
    
  }catch (err) {
    console.log(err)
    res.end()
  }
  
})

router.put('/updateCity/:cityId', async (req, res) => {
  const cityToUpdate = await City.find({_id:req.params.cityId}).exec()
  
  try{
    let response = await axios.get(`${API_URL}/weather`,{params:{id:cityToUpdate[0].cityId,units:'metric',appid: API_KEY}})
    console.log(response)
    const formatedRes = {
      cityId:response.data.id,
      temp: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      name: response.data.name,
      icon: response.data.weather[0].icon,
      condition: response.data.weather[0].description,
      lastUpdate: new Date()
    }
    const savedItem = await City.findOneAndUpdate({cityId:formatedRes.cityId},{$set:formatedRes},{useFindAndModify:false,new: true}).exec()

    //console.log(savedItem)
    res.send(savedItem)
    res.end()

  }catch (err) {
    console.log(err)
    res.end()
  }
  
})

const getCityImage = async (cityName) => {
  try{
    let response = await axios.get(`${IMAGE_URL}`,{params:{per_page:1,page:1,client_id:IMAGE_KEY,query:cityName}})
    return response.data.results[0].urls.full
  } catch (err) {

  }
  
}

module.exports = router