/**
 * Service for submission notification processor.
 */
const _ = require('lodash')
const Joi = require('joi')
const config = require('config')
const logger = require('../common/logger')
const helper = require('../common/helper')

/**
 * Fetch submission details
 * @param submissionId
 * @returns {Promise<>}
 * @private
 */
async function _fetchSubmissionDetails (submissionId) {
  const submission = await helper.apiFetchAuthenticated(`${config.SUBMISSION_API_URL}/${submissionId}`)
  const challengeResponse = await helper.apiFetchAuthenticated(`${config.CHALLENGE_API_URL}/${submission.challengeId}`)
  const challenge = _.get(challengeResponse, 'result.content')
  // Ignore SRMs
  if (challenge.subTrack === 'SRM') {
    throw new Error('SRMs are ignored')
  }

  // Fetch member details
  const {
    createdBy: submitterHandle
  } = submission
  const submitter = await _fetchUserDetails(submitterHandle)

  return {
    data: {
      submitter,
      submission,
      challenge: _.pick(challenge, [
        'challengeTitle', 'challengeId', 'submissionEndDate', 'prizes', 'challengeCommunity',
        'subTrack', 'technologies', 'platforms', 'numberOfRegistrants', 'numberOfSubmissions'
      ])
    },
    version: config.VERSION,
    recipients: [submitter.email],
    replyTo: ''
  }
}

/**
 * Fetch user details
 * @param handle User handle
 * @returns {Promise<>}
 * @private
 */
async function _fetchUserDetails (handle) {
  const memberResponse = await helper.apiFetch(`${config.MEMBER_API_URL}/${handle}`)
  const member = _.get(memberResponse, 'result.content')
  const userResponse = await helper.apiFetchAuthenticated(`${config.USER_API_URL}/?filter=id=${member.userId}`)

  return {
    handle,
    email: _.get(userResponse, 'result.content[0].email', ''),
    rating: member.maxRating
  }
}

/**
 * Fetch review details
 * @param typeId Review type ID
 * @returns {Promise<>}
 * @private
 */
async function _fetchReviewTypeDetails (typeId) {
  const reviewResponse = await helper.apiFetchAuthenticated(`${config.REVIEW_TYPE_API_URL}/${typeId}`)
  return reviewResponse
}

/**
 * Handle 'submission' message
 * @param {Object} message the message
 * @returns {Promise<>}
 */
async function processSubmission (message) {
  // Fetch submission details
  const {
    id
  } = message.payload
  
  return _fetchSubmissionDetails(id)
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
 * @returns {Promise<>}
 */
async function processReview (message) {
  const {
    submissionId, reviewerId, typeId
  } = message.payload
  const reviewType = await _fetchReviewTypeDetails(typeId)
  const submissionDetails = await _fetchSubmissionDetails(submissionId)
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
