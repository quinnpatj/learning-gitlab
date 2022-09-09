'use strict'

const config = require('config')
const expValidation = require('express-validation')
const log = require('nmlvhub-node-logger')
const {
  validation,
  notFound,
  error
} = require('../../middleware/error-handling')

jest.mock('config')
jest.mock('nmlvhub-node-logger')

describe('errorHandlingMiddleware', () => {
  describe('#validation() handler', () => {
    it('if called with an express validation error and detailed errors it should return a detailed error', () => {
      config.get.mockReturnValue({ detailedErrors: true })
      const json = jest.fn()
      const res = {
        status: jest.fn(() => ({
          json
        }))
      }
      const next = jest.fn()
      const validationError = new expValidation.ValidationError(
        ['bad syntax'],
        { status: 400 }
      )
      const validationHandler = validation()
      validationHandler(validationError, null, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith(validationError)
      expect(next).not.toHaveBeenCalled()
    })
    it('if called with an express validation error in prod it should return a simple error (Bad Request)', () => {
      config.get.mockReturnValue({ detailedErrors: false })
      const json = jest.fn()
      const res = {
        status: jest.fn(() => ({
          json
        }))
      }
      const next = jest.fn()
      const validationError = new expValidation.ValidationError(
        ['bad syntax'],
        { status: 400 }
      )
      const validationHandler = validation()
      validationHandler(validationError, null, res, next)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(json).toHaveBeenCalledWith({ msg: 'Bad Request' })
      expect(next).not.toHaveBeenCalled()
    })
    it('if called without an express validation error, it should call next with an error', async () => {
      const next = jest.fn()
      const regularError = new Error('this is an error')
      const validationHandler = validation()
      await validationHandler(regularError, {}, {}, next)

      expect(next).toHaveBeenCalledWith(regularError)
    })
  })
  describe('#notFound() handler', () => {
    it('should call next function with an error', async () => {
      const next = jest.fn()
      const notFoundHandler = notFound()

      await notFoundHandler({}, {}, next)

      expect(next).toHaveBeenCalledWith(
        new Error('InvalidUri or InvalidHttpVerb')
      )
    })
  })
  describe('#error() handler', () => {
    it('should call log.error on an error from the req or independently', async () => {
      const next = jest.fn()
      log.error = jest.fn()
      const req = {
        log
      }
      const res = {
        status: jest.fn(),
        json: jest.fn()
      }

      const errorHandler = error()

      await errorHandler(new Error('this is a problem'), req, res, next)
      expect(req.log.error).toHaveBeenCalled()
      await errorHandler(new Error('this is a problem'), {}, res, next)
      expect(log.error).toHaveBeenCalled()
    })
  })
})
