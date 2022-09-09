const log = require('nmlvhub-node-logger')

exports.requestStart = () => (req, res, next) => {
  req.log = log.child({
    requestPath: req.url,
    environment: process.env.NODE_APP_INSTANCE || process.env.NODE_ENV,
    correlationId: req.headers['x-nmlvhub-corid'],
    httpVerb: req.method,
    params: req.params,
    headers: req.headers
  })
  req.log.info('Request received')
  next()
}

exports.requestComplete = () => (req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    var duration = Date.now() - start
    req.log.info(
      {
        responseCode: res.statusCode,
        ServiceResponseTime: duration
      },
      'Service Response Time'
    )
  })
  next()
}
