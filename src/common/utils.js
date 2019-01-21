/**
 * This module contains method to build Kafka options.
 */
const config = require('config')

module.exports = {
  /**
   * Get Kafka consumer options from configuration file.
   * @return Kafka options from configuration file.
   */
  getKafkaConsumerOptions: () => {
    const options = { connectionString: config.KAFKA_CONSUMER_URL, handlerConcurrency: 1, groupId: config.KAFKA_CONSUMER_GROUP_ID }
    if (config.KAFKA_CLIENT_CERT && config.KAFKA_CONSUMER_CLIENT_CERT_KEY) {
      options.ssl = { cert: config.KAFKA_CONSUMER_CLIENT_CERT, key: config.KAFKA_CONSUMER_CLIENT_CERT_KEY }
    }
    return options
  },
  /**
   * Get Kafka producer options from configuration file.
   * @return Kafka options from configuration file.
   */
  getKafkaProducerOptions: () => {
    const options = { connectionString: config.KAFKA_PRODUCER_URL, handlerConcurrency: 1 }
    if (config.KAFKA_PRODUCER_CLIENT_CERT && config.KAFKA_PRODUCER_CLIENT_CERT_KEY) {
      options.ssl = { cert: config.KAFKA_PRODUCER_CLIENT_CERT, key: config.KAFKA_PRODUCER_CLIENT_CERT_KEY }
    }
    return options
  }
}
