'use strict'

const apikey = process.env.apikey

exports.appendApikeyHeader = (requestParams, context, ee, next) => {
  if (!requestParams.headers) {
    requestParams.headers = {}
  }
  requestParams.headers.apikey = apikey
  next()
}
