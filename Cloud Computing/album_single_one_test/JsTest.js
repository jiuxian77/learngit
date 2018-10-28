var fs = require('fs');
function sendtoS3(name, destination, filename){
	var AWS = require('aws-sdk');
	var uuid = require('node-uuid');
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

function show(destination, filename, response, request) {
console.log("Request handler 'show' was called.");
fs.readFile("./" + destination + filename, "binary", function(error, file) {
    if(error) {
      response.writeHead(500, {"Content-Type": "text/plain"});
      response.write(error + "\n");
      response.end();
    } else {
      response.writeHead(200, {"Content-Type": "image/*"});
      response.write(file, "binary");
      response.end();
    }
});
}

module.exports.sendtoS3 = sendtoS3;
module.exports.show = show;

