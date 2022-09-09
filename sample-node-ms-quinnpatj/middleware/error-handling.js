const validate = require('express-validation')
const config = require('config')
const newrelic = require('newrelic')
const log = require('nmlvhub-node-logger')

// Catch validation errors (express-validation)
exports.validation = () => (err, req, res, next) => {
  // Specific for validation errors
  if (err instanceof validate.ValidationError) {
    if (config.get('validationConfig').detailedErrors) {
      return res.status(err.status).json(err)
    }
    return res.status(err.status).json({ msg: 'Bad Request' })
  }
  next(err)
}

// 404 not found handler
exports.notFound = () => (req, res, next) => {
  const err = new Error('InvalidUri or InvalidHttpVerb')
  err.status = 400
  next(err)
}

// Production error handler
// sends empty body and 500 error
exports.error = () => (err, req, res, next) => {
  if (req && req.log) {
    req.log.error(err)
  } else {
    log.error(err)
  }
  newrelic.noticeError(err)
  res.status(err.status || 500)
  const environment = process.env.NODE_APP_INSTANCE || process.env.NODE_ENV
  if (environment === 'prod') {
    res.json({
      msg: 'Internal server error'
    })
  } else {
    res.json({
      msg: err.message,
      stack: err.stack
    })
  }

  next(err)
}
