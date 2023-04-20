const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://Assignment6:password1234@ase220.8znrdij.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

function process(req,res){
  //Obtain request method
  console.log(req.method);

  //Obtain the current timestamp (why do we need this?)
  const currentDate=new Date();
  const timestamp=currentDate.getTime();
  console.log(timestamp);

  //Write something in the header of the response 
  //res.setHeader('Access-Control-Allow-Origin', '*');
  //res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE');
  //res.setHeader('Access-Control-Max-Age', 2592000); // 30 days
  //res.writeHead(200,{'Content-Type':'application/json'});

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
		res.end();
  }
}

async function GET(req, res) {
	const collection = client.db("Assignment_6").collection("Albums");
  
	try {
	  const result = await collection.findOne({});
  
	  if (result && result.Data) {
		res.write(JSON.stringify(result.Data));
	  } else {
		res.write("File not found");
	  }
  
	  res.end();
	} catch (error) {
	  console.error(error);
	  res.end("Error occurred while retrieving file");
	}
  }


//POST request using MongoDB
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

async function PUT(req, res){
	const collection = client.db("Assignment_6").collection("Albums");
  
	// Obtain file name
	let myfile=req.url.split('/')[2];
  
	try {
	  let body = '';
  
	  req.on('data',(chunk)=>{
		body += chunk.toString();
	  }).on('end',async ()=>{
		console.log(body);
  
		try {
		  let data = JSON.parse(body);
  
		  const result = await collection.updateOne(
			{},
			{ $set: { Data: data } },
			{ upsert: true }
		  );
  
		  console.log(result);
  
		  res.write('\n'+myfile);
		  res.end();
		} catch (error) {
		  console.error(error);
		  res.end("Invalid JSON input");
		}
	  });
	} catch (error) {
	  console.error(error);
	  res.end("File not found");
	}
  }

async function DELETE(req, res){
	//Parse requested object ID to be deleted from URL endpoint
	const urlParts = req.url.split('/');
	const index = urlParts[2];

	try {
		//attempt a connection
		await client.connect;

		//refer to our collection
		const collection = client.db("Assignment_6").collection("Albums");

		//delete requested document
		const result = await collection.updateOne({}, { $unset: { [`Data.${index}`]: 1 } });

		//if statement to test the results and return a success/error code
		if (result.modifiedCount === 1) {
			res.writeHead(200);
			res.write(`Object ${index} successfully deleted`);
			console.log(`Delete of index ${index} performed successfully`)
		} else {
			res.writeHead(404);
			res.write(`Index ${index} not found`);
			console.log(`Requested delete of index ${index} not found`)
		}
	}	catch (err) {
		//console error if error
		console.error(err);
		res.writeHead(500);
		res.write("Unexpected error")
	}	finally {
		// Close the connection
		await client.close();
		res.end();
	}
}
module.exports=process;