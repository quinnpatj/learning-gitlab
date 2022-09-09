'use strict'

process.env.NODE_ENV = 'development'
process.env.NODE_APP_INSTANCE = 'int'
const request = require('supertest')
const express = require('express')
const app = express()
const newrelicMiddleware = require('../../middleware/new-relic.js')
const newrelic = require('newrelic')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(newrelicMiddleware())
app.use('/', (req, res) => {
  return res.json({})
})

describe('new relic middleware', () => {
  it('should add the new relic custom parameters', () => {
    newrelic.addCustomAttribute = jest.fn()
    return request(app)
      .get('/')
      .set('x-nm-nm_uid', 'test4')
      .set('x-nm-user-type', 'test5')
      .set('Cookie', [
        'X_NM_CLIENT_CONTEXT={"clientNmUniqueId": "test1", "worksForNmUniqueId": "test2", "worksForEmployeeType": "test3"}'
      ])
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        if (res) {
          console.log("expecting...")
        }
        expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
          'nmUniqueId',
          'test4'
        )
        expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
          'employeeType',
          'test5'
        )
        expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
          'clientNmUniqueId',
          'test1'
        )
        expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
          'worksForNmUniqueId',
          'test2'
        )
        expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
          'worksForEmployeeType',
          'test3'
        )
      })
  })

  it('should add the new relic custom parameters when no headers are present', done => {
    newrelic.addCustomAttribute = jest.fn()
    return request(app)
      .get('/')
      .set('Cookie', ['X_NM_CLIENT_CONTEXT={}'])
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err) => {
        if (err) return done.fail(err)
        expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
          'nmUniqueId',
          'no_user'
        )
        expect(newrelic.addCustomAttribute).toHaveBeenCalledWith(
          'employeeType',
          'no_user_type'
        )
        return done()
      })
  })
})
