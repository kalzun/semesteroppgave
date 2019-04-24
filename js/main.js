
const KOMNR = "kommunenummer";
const MENN = "Menn";
const KVINNER = "Kvinner";
const BEGGE = "Begge kjønn";
const GRUNNSKOLE = "01", 
	VGS = "02a", 
	FAGSKOLE = "11", 
	UNIKORT = "03a", 
	UNILANG = "04a", 
	UTENUTD =  "09a";

AlleKommunerSingleton = (function() {
	var instance;
	var _IDs = [];
	var _names = [];
	var _all = [];
	var _inhabitants = [];
	var _employementRates = [];
	var _education = [];


	function init(){

		function setup(dataset) {

			function buildIds() {
				for (i in dataset[0].elementer){
					_IDs.push(dataset[0].elementer[i][KOMNR]);
					buildName(i);
				}
				for (i in dataset[1].elementer){
					if (!_IDs.includes(dataset[1].elementer[i][KOMNR])){
						_IDs.push(dataset[1].elementer[i][KOMNR]);
						buildName(i);
					}
				}
				for (i in dataset[2].elementer){
					if (!_IDs.includes(dataset[2].elementer[i][KOMNR])){
						_IDs.push(dataset[2].elementer[i][KOMNR]);
						buildName(i);
					}
				}

				// 	// check difference
				// var diff1v2 = _IDs.filter(num => (!_IDs2.includes(num)));
				// var diff1v3 = _IDs.filter(num => (!_IDs3.includes(num)));
				// var diff2v3 = _IDs2.filter(num => (!_IDs3.includes(num)));
				// var diff3v1 = _IDs3.filter(num => (!_IDs.includes(num)));
				// var diff3v2 = _IDs3.filter(num => (!_IDs2.includes(num)));
				
				// for (i in diff3v1){
				// 	_IDs.push(diff3v1[i]);
				// 	buildName(dataset[2].elementer[i]);
				// }

				// var diff3v1After = _IDs3.filter(num => (!_IDs.includes(num)));
				// console.log(`Diff3v1 ${diff3v1After} length: ${diff3v1After.length} and ${typeof diff3v1After}`);
				// //return diff3v1;
			}

			buildIds();
			buildInhabitants();
			buildEmploymentRates();
			buildEducationRates();
			

			function buildName(name) {
				_names.push(name);
			}

			function buildInhabitants(){
				for (i in dataset[0].elementer)
					_inhabitants.push(dataset[0].elementer[i]);
			}

			function buildEmploymentRates() {
				for (name in dataset[1].elementer)
				 	_employementRates.push(dataset[1].elementer[name]);
			}

			function buildEducationRates() {
				for (name in dataset[2].elementer)
					_education.push(dataset[2].elementer[name]);
			}

			function depcr_buildInhabitants(){
				for (i in dataset[0].elementer){
					_names.push(i);
					_inhabitants.push(dataset[0].elementer[i]);

					for (name in dataset[1].elementer)
						if (i == name)
							_employementRates.push(dataset[1].elementer[name]);

					for (name in dataset[2].elementer)
						if (i == name)
							_education.push(dataset[2].elementer[name]);
				}
				for (i in dataset[2].elementer){
					console.log("Name already? " + _names.includes(i))
					if (_names.includes(i)) 
						continue;
					_names.push(i);

					_education.push(dataset[2].elementer[i]);

					for (name in dataset[1].elementer)
						if (i == name)
							_employementRates.push(dataset[1].elementer[name]);

					for (name in dataset[0].elementer)
						if (i == name)
							_inhabitants.push(dataset[0].elementer[name]);				
				}
			}

			// Lager alle kommuneobjektene:
			for (id in _IDs){
				var _ = new Kommuneobj(_names[id], _IDs[id]);
				_all.push(_);
			}
			
		}

		function getAlleKommuner() {
			return _all;
		}

		function getAllIDs(){
			return _IDs;
		}

		function getAllNames(){
			return _names;
		}

		function getID(name){
			for (n in _names){
				if (name == _names[n])
					return _IDs[n];
			}
		}

		function getName(id){
			for (i in _IDs){
				if (id == _IDs[i])
					return _names[i];
			}
		}

		function getInfo(id){
			for (i in _all)
				if (id == _all[i].id)
					return _all[i];
			return "None found";
		}

		function getInhabitants(id){
			for (i in _inhabitants)
				if (_inhabitants[i][KOMNR] == id) return _inhabitants[i];			
		}

		function getEmploymentRates(id){
			for (i in _employementRates)
				if (_employementRates[i][KOMNR] == id) return _employementRates[i];			
		}

		function getEducation(id){
			for (i in _education)
				if (_education[i][KOMNR] == id) return _education[i];			
		}

		return {
			setup: setup,
			getAlleKommuner: getAlleKommuner,
			getAllIDs: getAllIDs,
			getAllNames: getAllNames,
			getID: getID,
			getName: getName,
			getInfo: getInfo,
			getInhabitants: getInhabitants,
			getEmploymentRates: getEmploymentRates,
			getEducation: getEducation,

		}
	}

	return {
		getInstance: function() {
			if (!instance){
				instance = init();
			}
			return instance;
		}
	}
}());

function httpRequest(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url);

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			setTimeout(() => {callback(xhr.responseText);}, 500);
		}
	};
	xhr.send();
}

var DataSet = function(urls) {
	this.urls = urls;
	this.onload = null;

	this.getNames = function() {
		var _ = AlleKommunerSingleton.getInstance()
		return _.getAllNames();
	}

	this.getIDs = function() {
		var _ = AlleKommunerSingleton.getInstance()
		return _.getAllIDs();
	}

	this.load = function() {
		if (this.data) return "Data is already loaded.";
		this.data = new Array();
		httpRequest(this.urls[0], (response0) => { 			// Befolkning
			httpRequest(this.urls[1], (response1) => { 		// Sysselsatte
				httpRequest(this.urls[2], (response2) => {	// Utdanning
					this.data.push(JSON.parse(response0, rmvUnused));
					this.data.push(JSON.parse(response1, rmvUnused));
					this.data.push(JSON.parse(response2, rmvUnused));
					if (this.onload) this.onload();
					this.singleton = AlleKommunerSingleton.getInstance();
					this.singleton.setup(this.data);
				});
			});
		});

		function rmvUnused(name, value) { 
			// Removes "datasett" before parsing to object, since we will not use this, and we inform about the ownership a different place. 
			if (name == "datasett") return undefined;
			else return value;
		}
	}

	this.getInfo = function(id) {
		var _ = AlleKommunerSingleton.getInstance()
		return _.getInfo(id);
	}
}

var People = function(id) {
	this.setup()
	this.inhabitants = this._kommuner.getInhabitants(id);
	this.employment = this._kommuner.getEmploymentRates(id);
	this.education = this._kommuner.getEducation(id);
};

People.prototype = {

	setup: function(){
		this._kommuner = AlleKommunerSingleton.getInstance();
		return this._kommuner;
	},

	getGenderByYear: function(gender, year) {
		return this.inhabitants[gender][year];
	},

	getEmploymentRatesByYear: function(year) {
		return this.employment[BEGGE][year];
	},

	getEmploymentRatesByGender: function(gender) {
		return this.employment[gender];
	},

	getEmploymentRatesByGenderAndYear: function(gender, year) {
		return this.employment[gender][year];
	},

	getEducationRates: function(edu){
		switch (edu) {
			case "grunnskole" || GRUNNSKOLE:	
				return this.education[GRUNNSKOLE];
				break;
			case "VGS" || VGS:
				return this.education[VGS];
				break;
			case "fagskole" || FAGSKOLE:
				return this.education[FAGSKOLE];
				break;	
			case "unikort" || UNIKORT:
				return this.education[UNIKORT];
				break;
			case "unilang" || UNILANG:
				return this.education[UNILANG];
				break;
			case "utenutdanning" || UTENUTD:
				return this.education[UTENUTD];
				break;
			default:
				// statements_def
				break;
		}
			return this.education;
	}
}

var Kommuneobj = function(navn, id) {
	this.navn = navn;
	this.id = id;
	this.people = new People(id);
}

var allUrls = ["http://wildboy.uib.no/~tpe056/folk/104857.json", // Befolkning
				"http://wildboy.uib.no/~tpe056/folk/100145.json", // Sysselsatte
				"http://wildboy.uib.no/~tpe056/folk/85432.json", // Utdanning
			  ]
var ds = new DataSet(allUrls);
ds.load()
var l = AlleKommunerSingleton.getInstance()

