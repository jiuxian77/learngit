function sendtoS3(name, destination, filename){
	var AWS = require('aws-sdk');
	var uuid = require('node-uuid');
	var fs = require('fs');
	// Create an S3 client
	var s3 = new AWS.S3();

	// Create a bucket and upload something into it
	var bucketName = 'admin-created-yzq';
	var keyName = name;
	
	// Read in the file, convert it to base64, store to S3
	fs.readFile(destination+filename, function (err, data) {
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
}

module.exports.sendtoS3 = sendtoS3;
