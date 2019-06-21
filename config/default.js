/**
   * The default configuration file.
   */
const fs = require('fs')

function fileIfExists (path) {
  return fs.existsSync(path) ? path : null
}

module.exports = {
  DISABLE_LOGGING: process.env.DISABLE_LOGGING || false, // If true, logging will be disabled
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',

  // Kafka consumer config
  KAFKA_CONSUMER_URL: process.env.KAFKA_URL || 'localhost:9092',
  KAFKA_CONSUMER_GROUP_ID: process.env.KAFKA_GROUP_ID || 'tc-submission-notification-processor-group',
  // below are used for secure Kafka connection, they are optional
  // for the local Kafka, they are not needed
  KAFKA_CONSUMER_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT || fileIfExists(
    `${__dirname}/../kafkadev.cert`),
  KAFKA_CONSUMER_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY || fileIfExists(
    `${__dirname}/../kafkadev.key`),
  // Kafka producer config
  KAFKA_PRODUCER_URL: process.env.KAFKA_URL || 'localhost:9092',
  // below are used for secure Kafka connection, they are optional
  // for the local Kafka, they are not needed
  KAFKA_PRODUCER_CLIENT_CERT: process.env.KAFKA_CLIENT_CERT || fileIfExists(
    `${__dirname}/../kafkadev.cert`),
  KAFKA_PRODUCER_CLIENT_CERT_KEY: process.env.KAFKA_CLIENT_CERT_KEY || fileIfExists(
    `${__dirname}/../kafkadev.key`),

  CREATE_NOTIFICATION_TOPIC: process.env.CREATE_NOTIFICATION_TOPIC || 'submission.notification.create',
  UPDATE_NOTIFICATION_TOPIC: process.env.UPDATE_NOTIFICATION_TOPIC || 'submission.notification.update',
  PRODUCER_TOPIC: process.env.PRODUCER_TOPIC || 'submission.notification.send',

  INCLUDE_UPDATES: process.env.INCLUDE_UPDATES || true,

  CHALLENGE_API_URL: process.env.CHALLENGE_API_URL || 'https://api.topcoder-dev.com/v4/challenges',
  SUBMISSION_API_URL: process.env.SUBMISSION_API_URL || 'https://api.topcoder-dev.com/v5/submissions',
  MEMBER_API_URL: process.env.MEMBER_API_URL || 'https://api.topcoder-dev.com/v3/members',
  USER_API_URL: process.env.USER_API_URL || 'https://api.topcoder-dev.com/v3/users',
  REVIEW_TYPE_API_URL: process.env.REVIEW_TYPE_API_URL || 'https://api.topcoder-dev.com/v5/reviewTypes',

  AUTH0_URL: process.env.AUTH0_URL || 'https://topcoder-dev.auth0.com/oauth/token',
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://m2m.topcoder-dev.com/',
  TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
  AUTH0_PROXY_SERVER_URL: process.env.AUTH0_PROXY_SERVER_URL,

  VERSION: process.env.VERSION || 'v3',

  tracing: {
    dataDogEnabled: process.env.DATADOG_ENABLED ? process.env.DATADOG_ENABLED === 'true' : true,
    lightStepEnabled: process.env.LIGHTSTEP_ENABLED ? process.env.LIGHTSTEP_ENABLED === 'true' : true,
    signalFXEnabled: process.env.SIGNALFX_ENABLED ? process.env.SIGNALFX_ENABLED === 'true' : false,

    dataDog: {
      service: process.env.DATADOG_SERVICE_NAME || 'tc-submission-notification-processor',
      hostname: process.env.DD_TRACE_AGENT_HOSTNAME
    },

    lightStep: {
      access_token: process.env.LIGHTSTEP_ACCESS_TOKEN,
      component_name: process.env.LIGHTSTEP_COMPONENT_NAME || 'tc-submission-notification-processor'
    },

    signalFX: {
      service: process.env.SIGNALFX_SERVICE_NAME || 'tc-submission-notification-processor',
      accessToken: process.env.SIGNALFX_ACCESS_TOKEN,
      url: `https://${process.env.SIGNALFX_TRACE_AGENT_HOSTNAME}:9080/v1/trace`
    }
  }
}
