'use strict'

const express = require('express')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')

const errorHandlingMiddleware = require('./middleware/error-handling')
const loggingMiddleware = require('./middleware/logging')
const contextCookieParser = require('./middleware/context-cookie-parser')
const newrelicMiddleware = require('./middleware/new-relic')

const basePath = '/api/v1/ms/app'

const app = express()

// Set good default headers for security
app.use(
  helmet({
    crossdomain: true, // checkmarx requirement
    dnsPrefetchControl: true,
    frameguard: true,
    hidePoweredBy: true, // IRM requirement
    hsts: true, // checkmarx requirement
    ieNoOpen: true,
    noSniff: true,
    xssFilter: true
  })
)

// Set a default CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"]
    },
    reportOnly: true
  })
)

app.use(loggingMiddleware.requestStart())
app.use(contextCookieParser())
app.use(cookieParser())
app.use(loggingMiddleware.requestComplete())
app.use(newrelicMiddleware())

// Health check route used to validate service is up and healthly
const health = require('./routes/health')
const doc = require('./routes/doc')

app.use(basePath + '/health', health)
app.use(basePath + '/doc', doc)

// Handle errors after main routes
app.use(errorHandlingMiddleware.validation())
app.use(errorHandlingMiddleware.notFound())
app.use(errorHandlingMiddleware.error())

module.exports = app
