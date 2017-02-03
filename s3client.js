'use strict'

let s3 = require('s3')
 
let client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId:      process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
    region:           process.env.AWS_REGION
  },
})

module.exports = {

  uploadFileFromPath: (fullPath, filename) => {
    let params = {
      localFile: fullPath,
      s3Params: {
        Bucket: 'bl-inbox-bucket',
        Key: 'inbox/' + filename
      },
    }

    let uploader = client.uploadFile(params)

    let uploadPromise = new Promise((resolve, reject) => {
      uploader.on('error', (err) => reject(err))
      uploader.on('end', () => resolve())
    })

    return uploadPromise
  }

}