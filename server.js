if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const router = require('./server/routes/api')
const app = express()


mongoose.connect("mongodb://localhost/weather",
{ useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.use('/', router)
const PORT = process.env.PORT || 4321
app.listen(PORT, function(){
  console.log(`Server is Serving, give it a Tip at PORT ${PORT}`)
})