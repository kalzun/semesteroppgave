var allDatasets = new Array();

function retrieveWildboy(url, callback){
	var data = null;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4 && xhr.status === 200) {
			console.log("Ya");
			callback(xhr.responseText);
			data = xhr.responseText;
		}
	}
	xhr.send();	
}

var Set = function(data){
	this.data = data;
}


var Dataset = function(urls) {
	this.urls = urls;
	this.data = null;
	this.loaded = false;
	this.onload = null;

	this.getNames = function() {
		if (this.data !== null) return this.data;
	}

	function logData(data, txt) {
		for (i in data){
			allDatasets.push(JSON.parse(data[i]));
		}
		//allDatasets.push(data);
		console.log("inside logdata: ", this);
	}

	this.load = function() {
		if (this.loaded == false){
			retrieveWildboy(urls[0], function(data0) {
				retrieveWildboy(urls[1], function(data1) {
					retrieveWildboy(urls[2], function(data2){
						logData([data0,data1,data2]);
					});
				});
			});
		}
		else {
			console.log("ELSE")
		}
	}

	this.populateData = function(data) {
		this.data = data;
		console.log("THIS DATA: ", this.data);
	}
}

function Dataset2(url){
	this.url = url;

	this.load = function() {
		return this.url;
	}
}

var allUrls = ["https://jsonplaceholder.typicode.com/todos/1",
			"https://jsonplaceholder.typicode.com/todos/2",
			"https://jsonplaceholder.typicode.com/todos/3",
			]


var ds1 = new Dataset(allUrls);
console.log("Set1: ", ds1);

ds1.onload = function() {
	console.log("It is loaded...")
}


//console.log("Load: ", ds1.load());
var ds2 = new Dataset2("url2");
console.log("Set2: ", ds2.load())