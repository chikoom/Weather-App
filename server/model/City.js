const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
  cityId:Number,
  name: String,
  temp: Number,
  feelsLike: Number,
  condition: String,
  icon:String,
  lastUpdate:Date,
  cityImage:String
})
const City = mongoose.model('City', citySchema)
module.exports = City