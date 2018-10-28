'use strict';
var fs = require('fs');
var express = require('express');
var multer  = require('multer')
var http = require('http');
var app = express();
var upload = multer({ dest: 'upload/' });

//var server = http.createServer(app);


//https://www.cnblogs.com/chyingp/p/express-multer-file-upload.html
//https://cnodejs.org/topic/564f32631986c7df7e92b0db
//https://blog.csdn.net/zsensei/article/details/79094714
//https://www.jb51.net/article/106708.htm

// 单图上传
//post 对服务器改变
//post '/upload'得与form 的action 一致
//浏览器用post方法把请求发送到localhost:3000/upload
//浏览器调用 upload.single()
//服务器去检查自己名下的地址(upload)与表单上传的服务器地址(upload)是否一致
//一致后，把上传图片放到/upload下。服务器说 请把你要加载的东西传过来 ret_code: '0'
app.post('/upload', upload.single('logo'), function(req, res, next){
	//浏览器向我(服务器)发req 
	//我(服务器)向浏览器发 res
	//请求 从浏览器->服务器 
	//我是指服务器
	// next 给中间件用
//  console.log(req.file);
    var fileFormat = (req.file.originalname);
    var m = require('./JsTest.js');
    m.sendtoS3(fileFormat);
    res.send({ret_code: '0'});
  
});


//get 只是对服务器查询
//浏览器请求访问服务器的localhost:3000/form
//浏览器用get方法把请求发送到服务器的localhost:3000/form
//服务器说 请把你要加载的东西传过来

//当使用get方法访问路径path时，执行handler指定的方法，而且handler方法还带有req和res两个参数供我们使用。
//req是请求过来时带的信息，比如参数query, body, 头部header等； res是我们作为服务器想要返回给浏览器的信息设置。
app.get('/form', function(req, res, next){
    var form = fs.readFileSync('./form.html', {encoding: 'utf8'});
//	浏览器向我(服务器)发的req
//	我(服务器)向浏览器发的res
    res.send(form);
});

app.listen(8080);
//server.listen(8080);