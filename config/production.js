/**
 * Production configuration file
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  CHALLENGE_API_URL: process.env.CHALLENGE_API_URL || 'https://api.topcoder.com/v4/challenges',
  SUBMISSION_API_URL: process.env.SUBMISSION_API_URL || 'https://api.topcoder.com/v5/submissions',
  MEMBER_API_URL: process.env.MEMBER_API_URL || 'https://api.topcoder.com/v3/members',
  USER_API_URL: process.env.USER_API_URL || 'https://api.topcoder.com/v3/users',

  AUTH0_URL: process.env.AUTH0_URL, // Auth0 credentials for M2M token
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://www.topcoder.com',
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET
}
