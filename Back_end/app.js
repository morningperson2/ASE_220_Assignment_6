const http=require('http');
const server=http.createServer().listen(8080);
const process=require('./lib/process.js');

server.on('request',async(req,res)=>{
	process(req,res);
});


