'use strict'

const request = require('request-promise')
const Promise = require('bluebird')
const uuidV4  = require('uuid/v4')
const co      = Promise.coroutine
const fs      = Promise.promisifyAll(require('fs'))

module.exports = {

  /**
   * Fetches JSON data from an external API, stores it, and sends it to
   * the client.
   */
  getComment: co(function*(event, context, callback) {

    let id = event.pathParameters['id']

    try {

      let data = yield request(`https://jsonplaceholder.typicode.com/comments/${id}`)

      yield saveAsync(data)

      console.log('Saved file successfully')

      let response = {
        statusCode: 200,
        body: JSON.stringify({
          message: data,
          input: event
        }),
      }

      context.callbackWaitsForEmptyEventLoop = false
      callback(null, response)

    } catch(err) {
      callback(err)
    }
  })
}

/**
 * Generates a UUID-based filename and saves the given data to a file
 * @param  {Object | string} data - either an object or a string
 * @return {Promise<void>}
 */
function saveAsync(data) {
  let filename = uuidV4() + '.json'
  let stringData = typeof data === 'string'
                    ? data
                    : JSON.stringify(data)

  console.log('Saving ' + filename)

  let write = Promise.promisify(fs.writeFile)

  return write('/tmp/' + filename, stringData)
}