'use strict'

const newrelic = require('newrelic')
const https = require('https')
const http = require('http')
const nmlvLastMileCerts = require('nmlvhub-node-certs-lastmile')
const log = require('nmlvhub-node-logger')
const config = require('config')
const app = require('./app')

let httpListenerPort = 8080
let httpsListenerPort = 8443

log.info('NODE_ENV: ' + config.util.getEnv('NODE_ENV'))
log.info('NODE_APP_INSTANCE: ' + config.util.getEnv('NODE_APP_INSTANCE'))
log.info('NODE_CONFIG_DIR: ' + config.util.getEnv('NODE_CONFIG_DIR'))
log.levels(
  0,
  process.env.BUNYAN_LOG_LEVEL
    ? parseInt(process.env.BUNYAN_LOG_LEVEL, 10)
    : 'info'
)

log.info('log.levels(): ' + log.levels())

const httpServer = http.createServer(app).listen(httpListenerPort, () => {
  log.info('app is listening at localhost:' + httpListenerPort)
})

const httpsServer = https
  .createServer(nmlvLastMileCerts.apiCerts, app)
  .listen(httpsListenerPort, () => {
    log.info('app is listening at localhost:' + httpsListenerPort)
  })

/**
 * Forcibly exits this process after the given seconds.
 * If the process does not gracefully exit within the given timeout, it will
 * forcibly exit. In accordance with the `process.exit` API, set
 * `process.exitCode` before calling this function to set the exit code.
 *
 * @param {Number} seconds - the number of seconds to wait before forcibly exitting
 * @returns {Timeout} the timer that will terminate this Node.js process
 */
function timeoutExit (seconds = 5) {
  const timeout = setTimeout(() => {
    log.fatal({ exitCode: process.exitCode }, `Application did not gracefully shutdown in ${seconds} seconds. Forcibly terminating.`)
    process.exit()
  }, seconds * 1000)
  // un-ref the timer so Node.js exits even with this running timer
  timeout.unref()
  return timeout
}

function closeServers () {
  httpServer.close(() => {
    log.info('HTTP server is shutdown')
  })
  httpsServer.close(() => {
    log.info('HTTPS server is shutdown')
  })
  newrelic.shutdown({ collectPendingData: true }, () => {
    log.info('Newrelic agent is shutdown')
  })
}

process.on('SIGTERM', () => {
  log.info('SIGTERM issued...app is shutting down')
  closeServers()
  timeoutExit()
})

process.on('uncaughtException', (error) => {
  log.fatal(error, 'Uncaught Exception! The server is now in an unrecoverable state. Terminating...')
  closeServers()
  // the app should exit on its own when there are no daemons running nor events on the event loop

  // forcibly terminate if haven't done so gracefully within timeout
  timeoutExit()
})

process.on('unhandledRejection', (reason, promise) => {
  log.error({
    err: reason,
    promise
  }, 'Unhandled Promise Rejection')
})
