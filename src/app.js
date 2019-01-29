/**
 * The application entry point
 */

global.Promise = require('bluebird')
const _ = require('lodash')
const config = require('config')
const healthcheck = require('topcoder-healthcheck-dropin')
const Kafka = require('no-kafka')
const logger = require('./common/logger')
const {
  getKafkaConsumerOptions, getKafkaProducerOptions
} = require('./common/utils')
const processorService = require('./services/ProcessorService')

// create consumer
const consumer = new Kafka.GroupConsumer(getKafkaConsumerOptions())
const producer = new Kafka.Producer(getKafkaProducerOptions())
// data handler
const dataHandler = async (messageSet, topic, partition) => {
  await Promise.each(messageSet, async (m) => {
    const message = m.message.value.toString('utf8')
    logger.info(
      `Handle Kafka event message; Topic: ${topic}; Partition: ${partition}; Offset: ${m.offset}; Message: ${message}.`
    )
    let messageJSON
    try {
      messageJSON = JSON.parse(message)
    } catch (e) {
      logger.error('Invalid message JSON.')
      logger.logFullError(e)
      // commit the message and ignore it
      await consumer.commitOffset({
        topic, partition, offset: m.offset
      })
      return
    }
    if (messageJSON.topic !== topic) {
      logger.error(`The message topic ${messageJSON.topic} doesn't match the Kafka topic ${topic}.`)
      // commit the message and ignore it
      await consumer.commitOffset({
        topic, partition, offset: m.offset
      })
      return
    }

    const resource = _.get(messageJSON, 'payload.resource')
    if (!_.includes(['review', 'submission'], resource)) {
      logger.info(`The resource type ${resource} is ignored.`)
      // commit the message and ignore it
      await consumer.commitOffset({
        topic, partition, offset: m.offset
      })
      return
    }

    try {
      // attempt to process the message
      let details
      if (resource === 'review') {
        details = await processorService.processReview(messageJSON)
      } else if (resource === 'submission') {
        details = await processorService.processSubmission(messageJSON)
        logger.debug(`details ${details}`)
      }
      // Send details with producer
      await producer.send({
        topic: config.PRODUCER_TOPIC,
        partition: 0,
        message: {
          value: JSON.stringify({
            topic: config.PRODUCER_TOPIC,
            originator: 'tc-submission-notification-processor',
            timestamp: (new Date()).toISOString(),
            'mime-type': 'application/json',
            payload: details
          })
        }
      })
      logger.info('Successfully processed the message and published the result on kafka')
    } catch (err) {
      logger.logFullError(err)
    } finally {
      // Commit offset regardless of error
      await consumer.commitOffset({
        topic, partition, offset: m.offset
      })
    }
  })
}

// check if there is kafka connection alive
const check = () => {
  if (!consumer.client.initialBrokers && !consumer.client.initialBrokers.length) {
    return false
  }
  let connected = true
  consumer.client.initialBrokers.forEach(conn => {
    logger.debug(`url ${conn.server()} - connected=${conn.connected}`)
    connected = conn.connected & connected
  })
  return connected
}

// consume configured topics and setup healthcheck endpoint
producer.init()
  .then(() => {
    const topics = [config.CREATE_NOTIFICATION_TOPIC]

    if (config.INCLUDE_UPDATES) {
      topics.push(config.UPDATE_NOTIFICATION_TOPIC)
    }

    logger.debug('Producer initialized successfully')
    return consumer
      .init([{
        subscriptions: topics,
        handler: dataHandler
      }])
  })
  .then(() => {
    healthcheck.init([check])
    logger.debug('Consumer initialized successfully')
  }).catch(logger.logFullError)

if (process.env.NODE_ENV === 'test') {
  module.exports = {
    consumer,
    producer
  }
}
