/**
 * Contains generic helper methods
 */
const _ = require('lodash')
const config = require('config')
const axios = require('axios')
const m2mAuth = require('tc-core-library-js').auth.m2m
const logger = require('./logger')
const m2m = m2mAuth(_.pick(config, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'AUTH0_PROXY_SERVER_URL']))

/* Function to get M2M token
 * @returns {Promise}
 */
async function getM2Mtoken () {
  return m2m.getMachineToken(config.AUTH0_CLIENT_ID, config.AUTH0_CLIENT_SECRET)
}

/**
 * Function to send request to Submission API
 * @param{String} path Complete path of the api endpoint
 * @returns {Promise}
 */
async function apiFetchAuthenticated (path) {
  // Token necessary to send request to Submission API
  const token = await getM2Mtoken()
  logger.debug(`Fetching from ${path}`)
  const response = await axios.get(path, { headers: { Authorization: `Bearer ${token}` } })

  return response.data
}

async function apiFetch (path) {
  logger.debug(`Fetching from ${path}`)
  const response = await axios.get(path)
  return response.data
}

module.exports = {
  apiFetch,
  apiFetchAuthenticated
}
