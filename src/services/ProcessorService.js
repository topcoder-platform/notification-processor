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
async function _fetchSubmissionDetails (submissionId, v5ChallengeId, memberId) {
  if (!v5ChallengeId || !memberId) {
    const submission = await helper.apiFetchAuthenticated(`${config.SUBMISSION_API_URL}/${submissionId}`)
    v5ChallengeId = submission.v5ChallengeId
    memberId = submission.memberId
  }
  const challenge = await helper.apiFetchAuthenticated(`${config.CHALLENGE_API_URL}/${v5ChallengeId}`)
  // Ignore SRMs
  if (challenge.legacy.subTrack === 'SRM') {
    throw new Error('SRMs are ignored')
  }

  // Ignore TopCrowd challenges
  if (challenge.timelineTemplateId === config.get('TOPCROWD_CHALLENGE_TEMPLATE_ID')) {
    throw new Error('TopCrowd challenges are ignored')
  }

  // Fetch member details
  const submitter = await _fetchUserDetails(memberId)

  return {
    data: {
      submitter: {
        handle: submitter.handle
      },
      submission: {
        id: submissionId
      },
      challenge: {
        challengeTitle: challenge.name
      }
    },
    version: config.VERSION,
    recipients: [submitter.email]
  }
}

/**
 * Fetch user details
 * @param userId User ID
 * @returns {Promise<>}
 * @private
 */
async function _fetchUserDetails (userId) {
  const user = await helper.apiFetchAuthenticated(`${config.MEMBER_API_URL}/?userId=${userId}&fields=handle,email`)
  if (!user.length) throw new Error(`User with ID ${userId} could not be found`)

  return {
    handle: _.get(user, '[0].handle'),
    email: _.get(user, '[0].email')
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
    id: submissionId,
    v5ChallengeId,
    memberId
  } = message.payload

  return _fetchSubmissionDetails(submissionId, v5ChallengeId, memberId)
}

processSubmission.schema = Joi.object({
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      resource: Joi.string().valid('submission').required(),
      id: Joi.string().uuid().required(),
      v5ChallengeId: Joi.string().uuid().required(),
      memberId: Joi.number().integer().min(1).required()
    }).unknown(true).required()
  }).required()
}).required()

/**
 * Handle 'review' message
 * @param {Object} message the message
 * @returns {Promise<>}
 */
async function processReview (message) {
  const {
    submissionId, typeId
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

processReview.schema = Joi.object({
  message: Joi.object().keys({
    topic: Joi.string().required(),
    originator: Joi.string().required(),
    timestamp: Joi.date().required(),
    'mime-type': Joi.string().required(),
    payload: Joi.object().keys({
      resource: Joi.string().valid('review').required(),
      id: Joi.string().uuid().required(),
      submissionId: Joi.string().uuid().required(),
      reviewerId: Joi.string().uuid().required(),
      typeId: Joi.string().uuid().required(),
      score: Joi.number().required()
    }).unknown(true).required()
  }).required()
}).required()

// Exports
module.exports = {
  processSubmission,
  processReview
}

logger.buildService(module.exports)
