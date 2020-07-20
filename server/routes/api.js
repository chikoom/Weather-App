const express = require('express')
const axios = require('axios')
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
    let response = await axios.get(API_URL,{params:{appid: API_KEY,q:cityName}})
    res.send(response.data)
  }catch(e){
    console.error(e)
  }finally{
    res.end()
  }
})

module.exports = router