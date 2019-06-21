/**
 * Service for submission notification processor.
 */
const _ = require('lodash')
const Joi = require('joi')
const config = require('config')
const communitiesMetadata = require('../communitiesMetadata.json')
const logger = require('../common/logger')
const helper = require('../common/helper')
const tracer = require('../common/tracer')

/**
 * Fetch submission details
 * @param submissionId
 * @param {Object} parentSpan Span object to handle
 * @returns {Promise<>}
 * @private
 */
async function _fetchSubmissionDetails (submissionId, parentSpan) {
  let submissionSpan = tracer.startChildSpans('getSubmission', parentSpan)
  submissionSpan.setTag('submissionId', submissionId)

  const submission = await helper.apiFetchAuthenticated(`${config.SUBMISSION_API_URL}/${submissionId}`)

  submissionSpan.finish()

  let challengeSpan = tracer.startChildSpans('getChallenge', parentSpan)
  challengeSpan.setTag('challengeId', submission.challengeId)

  const challengeResponse = await helper.apiFetchAuthenticated(`${config.CHALLENGE_API_URL}/${submission.challengeId}`)

  challengeSpan.finish()

  const challenge = _.get(challengeResponse, 'result.content')
  // Ignore SRMs
  if (challenge.subTrack === 'SRM') {
    throw new Error('SRMs are ignored')
  }

  // Fetch member details
  const {
    memberId: submitterId
  } = submission
  const submitter = await _fetchUserDetails(submitterId, parentSpan)

  // Populate communities & community details
  let challengeESSpan = tracer.startChildSpans('getChallengeES', parentSpan)
  challengeESSpan.setTag('challengeId', submission.challengeId)

  const challengeESResponse = await helper.apiFetchAuthenticated(`${config.CHALLENGE_API_URL}?filter=id=${submission.challengeId}`)

  challengeESSpan.finish()

  const challengeES = _.get(challengeESResponse, 'result.content[0]', [])
  const challengeGroups = _.get(challengeES, 'groupIds', []).map(id => id.toString())
  const challengeCommunities = _.filter(communitiesMetadata, c => _.intersection(c.groupIds, challengeGroups).length > 0)
  const communities = {}
  _.each(challengeCommunities, (community) => {
    communities[community.communityId] = community
  })
  return {
    data: {
      submitter,
      submission,
      challenge: {
        ..._.pick(challenge, [
          'challengeTitle', 'challengeId', 'submissionEndDate', 'prizes', 'challengeCommunity',
          'subTrack', 'technologies', 'platforms', 'numberOfRegistrants', 'numberOfSubmissions'
        ]),
        communities
      }
    },
    version: config.VERSION,
    recipients: [submitter.email],
    replyTo: ''
  }
}

/**
 * Fetch user details
 * @param userId User ID
 * @param {Object} parentSpan Span object to handle
 * @returns {Promise<>}
 * @private
 */
async function _fetchUserDetails (userId, parentSpan) {
  let userSpan = tracer.startChildSpans('getUser', parentSpan)
  userSpan.setTag('userId', userId)

  const userResponse = await helper.apiFetchAuthenticated(`${config.USER_API_URL}/?filter=id=${userId}`)

  userSpan.finish()

  const user = _.get(userResponse, 'result.content[0]')
  if (!user) throw new Error(`User with ID ${userId} could not be found`)

  let memberSpan = tracer.startChildSpans('getUserRank', parentSpan)
  memberSpan.setTag('handle', user.handle)

  const memberResponse = await helper.apiFetch(`${config.MEMBER_API_URL}/${user.handle}`)

  memberSpan.finish()

  const member = _.get(memberResponse, 'result.content')

  return {
    handle: _.get(user, 'handle'),
    email: _.get(user, 'email'),
    rating: member.maxRating
  }
}

/**
 * Fetch review details
 * @param typeId Review type ID
 * @param {Object} parentSpan Span object to handle
 * @returns {Promise<>}
 * @private
 */
async function _fetchReviewTypeDetails (typeId, parentSpan) {
  let reviewTypeSpan = tracer.startChildSpans('getReviewType', parentSpan)
  reviewTypeSpan.setTag('typeId', typeId)

  const reviewResponse = await helper.apiFetchAuthenticated(`${config.REVIEW_TYPE_API_URL}/${typeId}`)

  reviewTypeSpan.finish()

  return reviewResponse
}

/**
 * Handle 'submission' message
 * @param {Object} message the message
 * @param {Object} span the Span object
 * @returns {Promise<>}
 */
async function processSubmission (message, span) {
  // Span is undefined during unittests. Create empty Spans object in order to avoid errors
  if (!span) {
    span = require('../common/tracer').startSpans('ProcessorService.processSubmission')
  }
  // Fetch submission details
  const {
    id
  } = message.payload
  span.setTag('payload.id', id)
  span.setTag('payload.resource', message.payload.resource)

  return _fetchSubmissionDetails(id, span)
}

processSubmission.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      resource: Joi.string().valid('submission').required(),
      id: Joi.string().uuid().required(),
      challengeId: Joi.number().integer().min(1).required(),
      memberId: Joi.number().integer().min(1).required()
    }).unknown(true).required()
  }).required()
}

/**
 * Handle 'review' message
 * @param {Object} message the message
 * @param {Object} span the Span object
 * @returns {Promise<>}
 */
async function processReview (message, span) {
  // Span is undefined during unittests. Create empty Spans object in order to avoid errors
  if (!span) {
    span = require('../common/tracer').startSpans('ProcessorService.processReview')
  }

  const {
    submissionId, typeId
  } = message.payload

  span.setTag('payload.submissionId', submissionId)
  span.setTag('payload.typeId', typeId)
  span.setTag('payload.resource', message.payload.resource)

  const reviewType = await _fetchReviewTypeDetails(typeId, span)
  const submissionDetails = await _fetchSubmissionDetails(submissionId, span)
  return {
    ...submissionDetails,
    data: {
      ...submissionDetails.data,
      reviewType,
      review: message.payload
    }
  }
}

processReview.schema = {
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      resource: Joi.string().valid('review').required(),
      id: Joi.string().uuid().required(),
      submissionId: Joi.string().uuid().required(),
      reviewerId: Joi.string().uuid().required()
    }).unknown(true).required()
  }).required()
}

// Exports
module.exports = {
  processSubmission,
  processReview
}

logger.buildService(module.exports)
