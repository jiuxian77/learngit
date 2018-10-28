'use strict';
//console.log('hello world');
//
//var s = new Set(['A', 'B', 'C']);
//s.forEach(function (element, sameElement, set) {
//  console.log(sameElement);
//});

// Load the SDK and UUID

var http = require("http");

http.createServer(function(request, response) { 
 
    response.writeHead(200, {"Content-Type": "text/html"}); 
 
    response.write("<html><head><title>AWS</title></head><body>"+
"<img src=\"https://s3.us-east-2.amazonaws.com/admin-created-yzq/4.jpg\"  alt=\"Error happen\" />" +
"</body></html>"); 
 
    response.end(); 
 
}).listen(8080);
