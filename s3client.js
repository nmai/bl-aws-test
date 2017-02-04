'use strict'

let fs  = require('fs')
let AWS = require('aws-sdk')
let s3  = new AWS.S3()

module.exports = {

  /**
   * Uploads a file to our bl-inbox-bucket
   * @param  {string} fullPath
   * @param  {string} filename
   * @return {Promise<any>} 
   */
  uploadFileFromPath: (fullPath, filename) => {
    let fileStream = fs.createReadStream(fullPath)

    var params = {
      Bucket: 'bl-inbox-bucket',
      Key: 'inbox/' + filename,
      Body: fileStream
    }

    let uploadPromise = new Promise((resolve, reject) => {
      s3.upload(params, function(err, data) {
        if(err)
          reject(err)
        else
          resolve(data)
      })
    })

    return uploadPromise
  }

}