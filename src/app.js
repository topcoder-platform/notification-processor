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
const tracer = require('./common/tracer')

// Initialize tracing if configured.
// Even if tracer is not initialized, all calls to tracer module will not raise any errors
if (config.has('tracing')) {
  tracer.initTracing(config.get('tracing'))
}

// create consumer
const consumer = new Kafka.GroupConsumer(getKafkaConsumerOptions())
const producer = new Kafka.Producer(getKafkaProducerOptions())
// data handler
const dataHandler = async (messageSet, topic, partition) => {
  await Promise.each(messageSet, async (m) => {
    const span = tracer.startSpans('dataHandler')
    span.setTag('kafka.topic', topic)
    span.setTag('message_bus.destination', topic)
    span.setTag('kafka.partition', partition)
    span.setTag('kafka.offset', m.offset)

    const message = m.message.value.toString('utf8')
    logger.info(
      `Handle Kafka event message; Topic: ${topic}; Partition: ${partition}; Offset: ${m.offset}; Message: ${message}.`
    )
    const parserSpan = tracer.startChildSpans('parseMessage', span)
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

      parserSpan.setTag('error', true)
      parserSpan.log({
        event: 'error',
        message: e.message,
        stack: e.stack,
        'error.object': e
      })
      parserSpan.finish()
      span.finish()

      return
    }
    parserSpan.finish()

    if (messageJSON.topic !== topic) {
      logger.error(`The message topic ${messageJSON.topic} doesn't match the Kafka topic ${topic}.`)
      // commit the message and ignore it
      await consumer.commitOffset({
        topic, partition, offset: m.offset
      })

      span.setTag('error', true)
      span.log({
        event: 'error',
        message: `The message topic ${messageJSON.topic} doesn't match the Kafka topic ${topic}`
      })
      span.finish()

      return
    }

    const resource = _.get(messageJSON, 'payload.resource')
    if (!_.includes(['review', 'submission'], resource)) {
      logger.info(`The resource type ${resource} is ignored.`)

      // commit the message and ignore it
      await consumer.commitOffset({
        topic, partition, offset: m.offset
      })

      span.log({
        event: 'info',
        message: `The resource type ${resource} is ignored.`
      })
      span.finish()

      return
    }

    let serviceSpan
    let producerSpan
    let isProducerError = false

    try {
      // attempt to process the message
      let details
      if (resource === 'review') {
        serviceSpan = tracer.startChildSpans('ProcessorService.processReview', span)
        details = await processorService.processReview(messageJSON, serviceSpan)
      } else if (resource === 'submission') {
        serviceSpan = tracer.startChildSpans('ProcessorService.processSubmission', span)
        details = await processorService.processSubmission(messageJSON, serviceSpan)
      }

      serviceSpan.finish()

      producerSpan = tracer.startChildSpans('sendMessage', span)
      producerSpan.setTag('topic', config.PRODUCER_TOPIC)
      producerSpan.setTag('originator', 'tc-submission-notification-processor')
      producerSpan.log({
        event: 'debug',
        payload: details
      })

      try {
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
      } catch (err) {
        isProducerError = true
        throw err
      }

      producerSpan.finish()

      logger.info('Successfully processed the message and published the result on kafka')
    } catch (err) {
      logger.logFullError(err)

      span.setTag('error', true)
      if (isProducerError) {
        producerSpan.log({
          event: 'error',
          message: err.message,
          stack: err.stack,
          'error.object': err
        })
        producerSpan.setTag('error', true)
        producerSpan.finish()
      } else {
        serviceSpan.log({
          event: 'error',
          message: err.message,
          stack: err.stack,
          'error.object': err
        })
        serviceSpan.setTag('error', true)
        serviceSpan.finish()
      }
    } finally {
      // Commit offset regardless of error
      await consumer.commitOffset({
        topic, partition, offset: m.offset
      })

      span.finish()
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
