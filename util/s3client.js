'use strict'

const BUCKET_NAME = 'bltest-bucket'

let fs  = require('fs')
let AWS = require('aws-sdk')
let s3  = new AWS.S3()

module.exports = {

  /**
   * Uploads a file to our bucket under the prefix "inbox"
   * @param  {string} fullPath
   * @param  {string} filename
   * @return {Promise<any>} 
   */
  uploadCommentFromFile: (fullPath, filename) => {
    let fileStream = fs.createReadStream(fullPath)

    var params = {
      Bucket: BUCKET_NAME,
      Key: 'inbox/' + filename,
      Body: fileStream
    }

    let uploadPromise = new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if(err)
          reject(err)
        else
          resolve(data)
      })
    })

    return uploadPromise
  },

  /**
   * Downloads a file from our bucket at the specified key
   * @return {[type]} [description]
   */
  downloadCommentFromS3: (key) => {
    var params = {
      Bucket: BUCKET_NAME,
      Key: key
    }

    let downloadPromise = new Promise((resolve, reject) => {
      s3.getObject(params, (err, data) => {
        if(err)
          reject(err)
        else
          resolve(data.Body.toString('utf-8'))
      })
    })

    return downloadPromise
  } 

}
