'use strict'

const request = require('supertest')
const express = require('express')
const fs = require('fs')
const swagger = JSON.parse(fs.readFileSync('swagger.json').toString())
const app = express()
const route = require('../routes/doc.js')
app.use(route)

describe('doc', () => {
  it('should return the swagger doc', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual(swagger)
      })
  })
})
