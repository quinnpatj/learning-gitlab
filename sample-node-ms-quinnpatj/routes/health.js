'use strict'

const express = require('express')
const router = express.Router()
const os = require('os')

/* Health check for app. */
router.get('/', (req, res) => {

  req.log.info(
    {
      responseCode: 200
    },
    'Health Check Request Complete'
  )

  return res.json({
    'Node Host': os.hostname(),
    'Git SHA': process.env.GIT_COMMIT
  })
})

module.exports = router
