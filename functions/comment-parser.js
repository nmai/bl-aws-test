'use strict'

const request   = require('request-promise')
const Promise   = require('bluebird')
const s3client  = require('../util/s3client')
const co        = Promise.coroutine
const fs        = Promise.promisifyAll(require('fs'))

module.exports = {
  
  /**
   * commentParser Handler Function - Triggered by S3 object create events.
   * Downloads the file under the given key, decodes the buffer, parses JSON, and prints to log.
   */
  handler: co(function*(event, context, callback) {
    try {
      let key = event.Records[0].s3.object.key

      let commentObject = JSON.parse(yield s3client.downloadCommentFromS3(key))

      // Print retrieved comment string so it may be viewed with cloudwatch
      console.log(commentObject)

      context.callbackWaitsForEmptyEventLoop = false
      callback(null, commentObject)
    } catch(err) {
      callback(err)
    }
  })

}