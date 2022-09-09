'use strict'

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '*.js',
    '!**/index.js',
    '!newrelic.js',
    '!__tests__/**/*.js',
    '!integration*/**',
    '!jest*.js',
    '!coverage/**'
  ],
  coverageDirectory: 'coverage',
  resetMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter'
}
