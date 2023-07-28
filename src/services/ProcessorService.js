/**
 * Service for submission notification processor.
 */
const _ = require('lodash')
const Joi = require('joi')
const config = require('config')
const communitiesMetadata = require('../communitiesMetadata.json')
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
    memberId: submitterId
  } = submission
  const submitter = await _fetchUserDetails(submitterId)

  // Populate communities & community details
  const challengeESResponse = await helper.apiFetchAuthenticated(`${config.CHALLENGE_API_URL}?filter=id=${submission.challengeId}`)
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
 * @returns {Promise<>}
 * @private
 */
async function _fetchUserDetails (userId) {
  const userResponse = await helper.apiFetchAuthenticated(`${config.USER_API_URL}/?filter=id=${userId}`)
  const user = _.get(userResponse, 'result.content[0]')
  if (!user) throw new Error(`User with ID ${userId} could not be found`)
  const memberResponse = await helper.apiFetch(`${config.MEMBER_API_URL}/${user.handle}`)
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

processSubmission.schema = Joi.object({
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
      reviewerId: Joi.string().uuid().required()
    }).unknown(true).required()
  }).required()
}).required()

// Exports
module.exports = {
  processSubmission,
  processReview
}

logger.buildService(module.exports)
