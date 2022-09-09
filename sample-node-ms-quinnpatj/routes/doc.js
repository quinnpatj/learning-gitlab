'use strict'
const express = require('express')
const router = express.Router()
const path = require('path')
const swagger = path.join(__dirname, '../swagger.json')

/* Health check for app. */
router.get('/', (req, res) => {
  return res.sendFile(swagger)
})

module.exports = router
