/*
 * Setting up Mock for tests
 */

const config = require('config')
const nock = require('nock')
const prepare = require('mocha-prepare')
const {
  challengeId,
  submissionId,
  submitterHandle,
  reviewTypeId,
  reviewType,
  challengeResponse,
  submissionResponse,
  submitterResponse,
  status500SubmissionId,
  userResponse,
  userId,
  SRMChallengeId,
  SRMChallengeResponse,
  SRMSubmissionId,
  SRMSubmissionResponse
} = require('../common/testData')

prepare((done) => {
  // called before loading of test cases
  nock.disableNetConnect()
  nock.enableNetConnect(`127.0.0.1`)
  nock.enableNetConnect(config.KAFKA_CONSUMER_URL)
  nock.enableNetConnect(config.KAFKA_PRODUCER_URL)
  // mock m2m token request
  nock(config.AUTH0_URL)
    .persist()
    .post(() => true)
    .reply(200, {access_token: 'token'})
  // mock submission api requests
  nock(config.SUBMISSION_API_URL)
    .persist()
    .get(`/${submissionId}`)
    .reply(200, submissionResponse)
    .get(`/${SRMSubmissionId}`)
    .reply(200, SRMSubmissionResponse)
    .get(`/${status500SubmissionId}`)
    .reply(500, {})

  // mock challange api request
  nock(config.CHALLENGE_API_URL)
    .persist()
    .get(`/${challengeId}`)
    .reply(200, challengeResponse)
    .get(`/${SRMChallengeId}`)
    .reply(200, SRMChallengeResponse)

  // mock member api request
  nock(config.MEMBER_API_URL)
    .persist()
    .get(`/${submitterHandle}`)
    .reply(200, submitterResponse)

  // mock review type api request
  nock(config.REVIEW_TYPE_API_URL)
    .persist()
    .get(`/${reviewTypeId}`)
    .reply(200, reviewType)

  // mock user api request
  nock(config.USER_API_URL)
    .persist()
    .get(`/?filter=id=${userId}`)
    .reply(200, userResponse)

  done()
}, (done) => {
  // called after all test completes (regardless of errors)
  nock.cleanAll()
  done()
})
