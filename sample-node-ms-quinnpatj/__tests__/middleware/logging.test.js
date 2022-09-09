'use strict'

const EventEmitter = require('events')
const loggingMiddleware = require('../../middleware/logging')
const log = require('nmlvhub-node-logger')

jest.mock('nmlvhub-node-logger')

const originalEnv = process.env

describe('logging middleware', () => {
  beforeEach(() => {
    jest.resetModules()

    process.env = { ...originalEnv }

    log.child.mockReturnValue(log)

    this.next = jest.fn()
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('#requestStart()', () => {
    it('creates a child logger and logs request received', () => {
      const req = {
        method: 'GET',
        url: 'https://authority',
        headers: {
          'Content-Type': 'application/json',
          'x-nmlvhub-corid': 'corid'
        },
        params: { key1: 'value1' }
      }

      loggingMiddleware.requestStart()(req, null, this.next)

      expect(log.child).toHaveBeenCalledWith({
        requestPath: 'https://authority',
        environment: 'test',
        correlationId: 'corid',
        httpVerb: 'GET',
        params: { key1: 'value1' },
        headers: {
          'Content-Type': 'application/json',
          'x-nmlvhub-corid': 'corid'
        }
      })
      expect(req.log.info).toHaveBeenCalledWith('Request received')
      expect(this.next).toHaveBeenCalledWith()
    })

    it('creates a child logger and logs request received when NODE_APP_INSTANCE is set', () => {
      process.env.NODE_APP_INSTANCE = 'app'

      const req = {
        method: 'GET',
        url: 'https://authority',
        headers: {
          'Content-Type': 'application/json',
          'x-nmlvhub-corid': 'corid'
        },
        params: { key1: 'value1' }
      }

      loggingMiddleware.requestStart()(req, null, this.next)

      expect(log.child).toHaveBeenCalledWith({
        requestPath: 'https://authority',
        environment: 'app',
        correlationId: 'corid',
        httpVerb: 'GET',
        params: { key1: 'value1' },
        headers: {
          'Content-Type': 'application/json',
          'x-nmlvhub-corid': 'corid'
        }
      })
      expect(req.log.info).toHaveBeenCalledWith('Request received')
      expect(this.next).toHaveBeenCalledWith()
    })
  })

  describe('#requestCompleted()', () => {
    it('logs response time and status', () => {
      const req = { log }
      const res = new EventEmitter()

      res.statusCode = 200

      loggingMiddleware.requestComplete()(req, res, this.next)

      res.emit('finish')

      expect(this.next).toHaveBeenCalledWith()
      expect(log.info.mock.calls[0][0].responseCode).toBe(200)
      expect(log.info.mock.calls[0][0].ServiceResponseTime).not.toBeNaN()
      expect(log.info.mock.calls[0][1]).toBe('Service Response Time')
    })
  })
})
