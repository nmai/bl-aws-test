'use strict'

const request   = require('request-promise')
const Promise   = require('bluebird')
const uuidV4    = require('uuid/v4')
const s3client  = require('../util/s3client')
const co        = Promise.coroutine
const fs        = Promise.promisifyAll(require('fs'))

module.exports = {

  /**
   * getComment Handler Function - Fetches JSON data from an external API,
   * stores it, and sends it to the client.
   */
  handler: co(function*(event, context, callback) {

    let id = event.pathParameters['id']

    try {
      const fileProperties = generateFileName()

      let data = yield request(`https://jsonplaceholder.typicode.com/comments/${id}`)
      yield saveAsync(data, fileProperties.filePath)
      yield s3client.uploadCommentFromFile(fileProperties.filePath, fileProperties.fileName)

      console.log('Saved and uploaded file successfully')

      let clientResponse = {
        statusCode: 200,
        body: data
      }

      context.callbackWaitsForEmptyEventLoop = false
      callback(null, clientResponse)
    } catch(err) {
      callback(err)
    }
  })

}

/* Helper functions (private) */

/**
 * Saves the given data to the filesystem
 * @param  {Object | string} data - either an object or a string
 * @param  {string} path - the full file path to save to
 * @return {Promise<any>}
 */
function saveAsync(data, path) {
  let stringData = typeof data === 'string' ? data : JSON.stringify(data)

  console.log('Saving to ' + path)

  let write = Promise.promisify(fs.writeFile)

  return write(path, stringData)
}

/**
 * Generates a UUID-based filename and path within the write-available
 * tmp directory of a Lambda instance.
 * @return {Object} fileName: string, filePath: string
 */
function generateFileName() {
  let name = uuidV4() + '.json'

  return {
    fileName: name,
    filePath: '/tmp/' + name
  }
}