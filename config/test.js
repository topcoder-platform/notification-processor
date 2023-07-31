/**
 * Configuration file to be used while running tests
 */

module.exports = {
  DISABLE_LOGGING: false, // If true, logging will be disabled
  LOG_LEVEL: 'debug',
  KAFKA_PRODUCER_URL: process.env.TEST_KAFKA_PRODUCER_URL || 'localhost:9092',
  KAFKA_CONSUMER_URL: process.env.TEST_KAFKA_CONSUMER_URL || 'localhost:9092',
  CHALLENGE_API_URL: process.env.TEST_CHALLENGE_API_URL || 'https://api.topcoder-dev.com/v5/challenges',
  SUBMISSION_API_URL: process.env.TEST_SUBMISSION_API_URL || 'https://api.topcoder-dev.com/v5/submissions',
  MEMBER_API_URL: process.env.TEST_MEMBER_API_URL || 'https://api.topcoder-dev.com/v5/members',
  WAIT_TIME: 1000 // small wait time used in test
}
