'use strict'

const request = require('supertest')
const express = require('express')
const app = express()
const contextCookieParser = require('../../middleware/context-cookie-parser.js')
app.use(contextCookieParser())
app.use('/', (req, res) => {
  return res.json(req.headers.cookie)
})

describe('context cookie parser', () => {
  it('should parse the context cookie', () => {
    return request(app)
      .get('/')
      .set(
        'cookie',
        'X_NM_CLIENT_CONTEXT=eyJjbGllbnRObVVuaXF1ZUlkIjogInRlc3QiLCAid29ya3NGb3JObVVuaXF1ZUlkIjogInRlc3QiLCAid29ya3NGb3JFbXBsb3llZVR5cGUiOiAidGVzdCJ9'
      )
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual(
          'X_NM_CLIENT_CONTEXT={"clientNmUniqueId": "test", "worksForNmUniqueId": "test", "worksForEmployeeType": "test"}; '
        )
      })
  })

  it('should parse the context cookie - non-NM cookie', () => {
    return request(app)
      .get('/')
      .set('cookie', 'cookie')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual('')
      })
  })

  it('should parse the context cookie - NM non-client cookie', () => {
    return request(app)
      .get('/')
      .set('cookie', 'X_NM_Cookie={"cookie": "cookie"}')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual('X_NM_Cookie={"cookie": "cookie"}; ')
      })
  })

  it('app route: should be able to parse a base64 encoded X_NM_CLIENT_CONTEXT cookie (Add 1 "=")', () => {
    return request(app)
      .get('/')
      .set(
        'cookie',
        'X_NM_CLIENT_CONTEXT=eyJjbGllbnRObVVuaXF1ZUlkIjogInRlc3QiLCAid29ya3NGb3JObVVuaXF1ZUlkIjogInRlc3QiLCAid29ya3NGb3JFbXBsb3llZVR5cGUiOiAidGVzdCJ9Cg='
      )
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual(
          'X_NM_CLIENT_CONTEXT={"clientNmUniqueId": "test", "worksForNmUniqueId": "test", "worksForEmployeeType": "test"}\n; '
        )
      })
  })

  it('app route: should be able to parse a base64 encoded X_NM_CLIENT_CONTEXT cookie (Add 2 "=")', () => {
    return request(app)
      .get('/')
      .set(
        'cookie',
        'X_NM_CLIENT_CONTEXT=eyJjbGllbnRObVVuaXF1ZUlkIjogInRlc3QiLCAid29ya3NGb3JObVVuaXF1ZUlkIjogInRlc3QiLCAid29ya3NGb3JFbXBsb3llZVR5cGUiOiAidGVzdCJ9Cg'
      )
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(res.body).toEqual(
          'X_NM_CLIENT_CONTEXT={"clientNmUniqueId": "test", "worksForNmUniqueId": "test", "worksForEmployeeType": "test"}\n; '
        )
      })
  })
})
