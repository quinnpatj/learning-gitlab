'use strict'

const request = require('supertest')
const app = require('../app')
const log = require('nmlvhub-node-logger')

const originalEnv = process.env

describe('the ms/app application path', () => {
  beforeEach(() => {
    jest.resetModules()

    process.env = { ...originalEnv }

    log.child.mockReturnValue(log)
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should be registered for health', async () => {
    await request(app)
      .get('/api/v1/ms/app/health')
      .expect(200)

    expect(log.child).toHaveBeenCalled()
  })

  it('should be registered for doc', () => {
    return request(app)
      .get('/api/v1/ms/app/doc')
      .expect('Content-Type', 'application/json; charset=UTF-8')
      .expect(200)
  })

  it('should set child logger on request with correlation id', async () => {
    await request(app)
      .get('/api/v1/ms/app/health')
      .set('x-nmlvhub-corid', 'test')
      .set('host', 'testHost')
      .set('user-agent', 'superagent')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(log.child).toHaveBeenCalledWith({
      requestPath: '/api/v1/ms/app/health',
      environment: 'test',
      correlationId: 'test',
      httpVerb: 'GET',
      params: {},
      headers: {
        host: 'testHost',
        'accept-encoding': 'gzip, deflate',
        'user-agent': 'superagent',
        'x-nmlvhub-corid': 'test',
        connection: 'close'
      }
    })
  })

  it('should provide a 400 response for invalid paths', () => {
    return request(app)
      .get('/api/v1/badaddress')
      .expect(400)
  })

  it.each(['NODE_APP_INSTANCE', 'NODE_ENV'])(
    'should provide a 400 response for invalid paths in prod (%o)',
    name => {
      process.env[name] = 'prod'

      return request(app)
        .get('/api/v1/badaddress')
        .expect(400, { msg: 'Internal server error' })
    }
  )
})
