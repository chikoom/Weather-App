const express = require('express')
const axios = require('axios')
const { Mongoose } = require('mongoose')
const City = require('../model/City')
const router = express.Router()
const API_KEY = process.env.WEATHER_API_KEY || ''
const API_URL = process.env.WEATHER_URL || ''

router.get('/sanity', (req,res) => {
  res.send('OK')
})

router.get('/city/:cityName', async (req,res) => {
  console.log(req.params.cityName)
  const {cityName} = req.params
  try{
    let response = await axios.get(API_URL,{params:{units:'metric',appid: API_KEY,q:cityName}})
    const formatedRes = {
      temp: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      name: response.data.name,
      description: response.data.weather[0].description,
      description2: response.data.weather[0].main
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
    let response = await axios.get(API_URL,{params:{units:'metric',appid: API_KEY,lat,lon}})
    console.log(response)
    const formatedRes = {
      temp: response.data.main.temp,
      feelsLike: response.data.main.feels_like,
      name: response.data.name,
      description: response.data.weather[0].description,
      description2: response.data.weather[0].main
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
  const {name,temp,condition,conditionPic} = req.body
  //validateData(req.body)
  try {
    const cityToSave = new City({name,temp,condition,conditionPic})
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
  try{
    let response = await City.findOneAndDelete({_id:cityId}).exec()
    res.send(response)
  }catch(err){
    console.error(err)
    res.status(500)
  }finally{
    res.end()
  }
})

module.exports = router