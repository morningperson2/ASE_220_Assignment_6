const fs=require('fs');
const url=require('url');

function process(req,res){
	//Obtain request method
	console.log(req.method);
	
	//Parse the components of the URL
	let url_components=url.parse(req.url,true);
	console.log(url_components);
	console.log(url_components.pathname.split('/'));
	
	//Obtain the current timestamp (why do we need this?)
	const currentDate=new Date();
	const timestamp=currentDate.getTime();
	console.log(timestamp);
	
	//Write something in the header of the response 
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
	res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
	res.writeHead(200,{'Content-Type':'application/json'});
	
	
	//Check the request method and call the appropriate function
	switch(req.method){
		case 'GET':
			GET(req,res);
			break;
		case 'POST':
			POST(req,res, timestamp);
			break;
		case 'PUT':
			PUT(req,res);
			break;
		case 'DELETE':
			DELETE(req,res);
			break;
		default:
			res.end("Method not supported");


	}
}


function GET(req, res){
	//check if file exists
	let myfile=req.url.split('/')[2]+'.json';
	if(fs.existsSync(`./data/${myfile}`)){

		//read data from file
		let data = fs.readFileSync(`./data/${myfile}`,'utf8');

		//respond with data
		res.end(data);
	}
	else{
		//respond with error message
		res.end("File not found");
	}
}

function POST(req, res, timestamp){
	//generate unique name for file
	let myFile=`${timestamp}.json`;

	//create file
	fs.appendFile(`./data/${myFile}`, '', function (err) {
		if (err) throw err;
	  });
	//read data from request
	var body=[];

	req.on('data',(chunk)=>{
		body.push(chunk);
	}).on('end',()=>{
		body=Buffer.concat(body).toString();

		console.log(body);
		res.write(body);
		try {
			let data = JSON.parse(body);
			//write data to file in json format
			fs.writeFileSync(`./data/${myFile}`,JSON.stringify(data));
			//respond with name of file
			res.write('\n'+myFile);
			console.log(myFile);
			res.end();
		} catch (error) {
			console.error(error);
			res.end("Invalid JSON input");
		}
	});

}

function PUT(req, res){
	//check if file exists
	let myfile=req.url.split('/')[2]+'.json';
	if(fs.existsSync(`./data/${myfile}`)){
		var body=[];

		req.on('data',(chunk)=>{
			body.push(chunk);
		}).on('end',()=>{
			body=Buffer.concat(body).toString();

			console.log(body);
			res.write(body);
			try {
				let data = JSON.parse(body);
				//write data to file in json format
				fs.writeFileSync(`./data/${myfile}`,JSON.stringify(data));
				//respond with name of file
				res.write('\n'+myfile);
				console.log(myfile);
				res.end();
			} catch (error) {
				console.error(error);
				res.end("Invalid JSON input");
			}
		});
	}
	else{
		//respond with error message
		res.end("File not found");
	}

}

function DELETE(req, res){
	//check if file exists
	let myfile=req.url.split('/')[2]+'.json';
	if(fs.existsSync(`./data/${myfile}`)){
		console.log(fs.existsSync(`./data/${myfile}`));
	

		//delete file
		fs.writeFileSync(`./data/${myfile}`,'');
		fs.unlinkSync(`./data/${myfile}`);

		//respond with success message
		res.end("SUCCESS");
	}
	else{
		//respond with error message
		res.end("File not found");
	}
}
module.exports=process;