var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var fs = require('fs');
// Create an S3 client
var s3 = new AWS.S3();

// Create a bucket and upload something into it
var bucketName = 'admin-created-yzq';
var keyName = '5.jpg';

// Read in the file, convert it to base64, store to S3
fs.readFile('5.jpg', function (err, data) {
  if (err) { throw err; }

  s3.putObject({
    Bucket: bucketName,
    Key: keyName,
    Body: data,
    ContentType:'image/jpeg',
    ACL:'public-read'
  }, function (err, data) {
    if(err) console.log(err, err.stack);
    else
        console.log('Successfully uploaded package.');
  });
});
