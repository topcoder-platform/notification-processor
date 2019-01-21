/**
 * Test cases for Processor Service
 */
const _ = require('lodash')
const config = require('config')
const should = require('should')
const processorService = require('../../src/services/ProcessorService')
const logger = require('../../src/common/logger')
const {
  testCases,
  invalidSubmissions,
  SRMChallengeId,
  SRMSubmissionId
} = require('../common/testData')

describe('Submission Notification Processor Unit Tests', () => {
  const infoLogs = []
  const errorLogs = []
  const info = logger.info
  const error = logger.error
  /**
   * Assert validation error
   * @param err the error to validate
   * @param message the error message
   */
  const assertValidationError = (err, message) => {
    err.isJoi.should.be.true()
    should.equal(err.name, 'ValidationError')
    err.details.map(x => x.message).should.containEql(message)
    errorLogs.should.not.be.empty()
    errorLogs.should.containEql(err.stack)
  }

  /**
   * Set submission id
   * @param message the message
   * @param submissionId the submission id
   */
  const setSubmissionId = (message, submissionId) => {
    if (_.get(message, 'payload.submissionId')) {
      message.payload.submissionId = submissionId
    } else if (_.get(message, 'payload.id')) {
      message.payload.id = submissionId
    }
  }

  before(() => {
    // inject logger with log collector
    logger.info = (message) => {
      infoLogs.push(message)
      if (!config.DISABLE_LOGGING) {
        info(message)
      }
    }
    logger.error = (message) => {
      errorLogs.push(message)
      if (!config.DISABLE_LOGGING) {
        error(message)
      }
    }
  })

  beforeEach(() => {
    // clear logs
    infoLogs.length = 0
    errorLogs.length = 0
  })

  after(() => {
    // restore logger
    logger.error = error
    logger.info = info
  })

  for (const testCase of Object.keys(testCases)) {
    const {testMessage, requiredFields, integerFields, stringFields, methodName, expectedResult} = testCases[testCase]
    it(`test ${testCase} with valid message(response 200 status)`, async () => {
      const result = await processorService[methodName](testMessage)
      result.should.deepEqual(expectedResult)
      errorLogs.should.be.empty()
    })
    if (invalidSubmissions) {
      for (const invalidSubmission of invalidSubmissions) {
        const {invalidSubmissionId, invalidStatus} = invalidSubmission
        it(`test ${testCase} with invalid submission id that returns ${invalidStatus}`, async () => {
          let message = _.cloneDeep(testMessage)
          setSubmissionId(message, invalidSubmissionId)
          try {
            await processorService[methodName](message)
            throw new Error('should throw error here')
          } catch (err) {
            errorLogs.should.not.be.empty()
            errorLogs.should.containEql(err.stack)
          }
        })
      }
    }
    if (requiredFields) {
      for (const requiredField of requiredFields) {
        it(`test ${testCase} message - invalid parameters, required field ${requiredField} is missing`, async () => {
          let message = _.cloneDeep(testMessage)
          message = _.omit(message, requiredField)
          try {
            await processorService[methodName](message)
            throw new Error('should throw error here')
          } catch (err) {
            assertValidationError(err, `"${_.last(requiredField.split('.'))}" is required`)
          }
        })
      }
    }
    it(`test ${testCase} message - invalid parameters, invalid timestamp`, async () => {
      let message = _.cloneDeep(testMessage)
      message.timestamp = 'invalid'
      try {
        await processorService[methodName](message)
        throw new Error('should throw error here')
      } catch (err) {
        assertValidationError(err, `"timestamp" must be a number of milliseconds or valid date string`)
      }
    })
    if (stringFields) {
      for (const stringField of stringFields) {
        it(`test ${testCase} message - invalid parameters, invalid string type field ${stringField}`, async () => {
          let message = _.cloneDeep(testMessage)
          _.set(message, stringField, 123)
          try {
            await processorService[methodName](message)
            throw new Error('should throw error here')
          } catch (err) {
            assertValidationError(err, `"${_.last(stringField.split('.'))}" must be a string`)
          }
        })
      }
    }
    if (integerFields) {
      for (const integerField of integerFields) {
        it(`test ${testCase} message - invalid parameters, invalid integer type field ${integerField}(wrong number)`, async () => {
          let message = _.cloneDeep(testMessage)
          _.set(message, integerField, 'string')
          try {
            await processorService[methodName](message)
            throw new Error('should throw error here')
          } catch (err) {
            assertValidationError(err, `"${_.last(integerField.split('.'))}" must be a number`)
          }
        })
        it(`test ${testCase} message - invalid parameters, invalid integer type field ${integerField}(wrong integer)`, async () => {
          let message = _.cloneDeep(testMessage)
          _.set(message, integerField, 1.1)
          try {
            await processorService[methodName](message)
            throw new Error('should throw error here')
          } catch (err) {
            assertValidationError(err, `"${_.last(integerField.split('.'))}" must be an integer`)
          }
        })
        it(`test ${testCase} message - invalid parameters, invalid integer type field ${integerField}(negative)`, async () => {
          let message = _.cloneDeep(testMessage)
          _.set(message, integerField, -1)
          try {
            await processorService[methodName](message)
            throw new Error('should throw error here')
          } catch (err) {
            const fieldName = _.last(integerField.split('.'))
            assertValidationError(err, `"${fieldName}" must be larger than or equal to 1`)
          }
        })
      }
    }
  }

  it(`test SRM challenge`, async () => {
    const testCase = testCases['Submission Create Notification']
    let message = _.cloneDeep(testCase.testMessage)
    _.set(message, 'payload.challengeId', SRMChallengeId)
    _.set(message, 'payload.id', SRMSubmissionId)
    try {
      await processorService[testCase.methodName](message)
      throw new Error('should throw error here')
    } catch (err) {
      errorLogs.should.not.be.empty()
      errorLogs.should.containEql(err.stack)
    }
  })
})
