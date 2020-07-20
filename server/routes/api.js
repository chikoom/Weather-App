const express = require('express')
const router = express.Router()

router.get('/sanity', (req,res) => {
  res.send('OK')
})

module.exports = router