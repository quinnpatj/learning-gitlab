'use strict'

const request = require('supertest')
const express = require('express')
const os = require('os')
const health = require('../routes/health')
const log = require('nmlvhub-node-logger')

jest.mock('os')
const app = express()

app.use((req, res, next) => {
  req.log = require('nmlvhub-node-logger')
  next()
})

app.use('/', health)

process.env.GIT_COMMIT = 'A12345'

describe('health', () => {
  it('should return the node server name and Git SHA', () => {
    log.info = jest.fn()
    os.hostname = jest.fn(() => 'testOS')
    return request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body['Node Host']).toEqual('testOS')
        expect(res.body['Git SHA']).toEqual('A12345')
      })
  })
})
