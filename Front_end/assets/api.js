const api={
	endpoint:'http://localhost:8080/api/',
	GET:function(documentID,callback){
		axios.get(`${api.endpoint}${documentID}`,{}).then(function(response){
			callback(response);
		}).catch(function(error){
			console.log(error);
		});
	},
	PUT:function(documentID,data,callback){
		axios.put(`${api.endpoint}${documentID}`,data).then(function(response){
			callback(response);
		}).catch(function(error){
			console.log(error);
		});
	}
}