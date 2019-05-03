const allUrls = ["http://wildboy.uib.no/~tpe056/folk/104857.json", // Befolkning
				"http://wildboy.uib.no/~tpe056/folk/100145.json", // Sysselsatte
				"http://wildboy.uib.no/~tpe056/folk/85432.json", // Utdanning
			  ]

const KOMNR = "kommunenummer";
const MENN = "Menn";
const KVINNER = "Kvinner";
const BEGGE = "Begge kjønn";

const [GRUNNSKOLE, 
	   VGS, 
	   FAGSKOLE, 
	   UNIKORT, 
	   UNILANG, 
	   UTENUTD] = ["01", "02a", "11", "03a", "04a", "09a"];

// Benytter Singleton-pattern, for å ha ett samlet objekt å forholde seg til ved spørringer.
// Denne funksjonen kjøres umiddelbart, og er ti

AlleKommunerSingleton = (function() {
	var instance;
	var _IDs = [];
	var _names = [];
	var _all = [];
	var _inhabitants = [];
	var _employmentRates = [];
	var _education = [];
	var _loaded = false


	function init(){

		function setup(dataset) {

			/*
				Går gjennom alle tre datasettene og lager:
				alle ID-ene (kommunenummer)
				inhabitants (innbyggere)
				employmentrates (sysselsatte)
				education (utdanning)
			*/

			(function buildIds() {

				// Første datasett (innbyggere)
				// Her legger vi til alle ID vi finner.

				for (i in dataset[0].elementer){
					_inhabitants.push(dataset[0].elementer[i]);
					_IDs.push(dataset[0].elementer[i][KOMNR]);
					_names.push(i);
				}

				// Andre datasett (sysselsatte).
				// Her legger vi til all info om sysselsatte.
				// Men vi sjekker om ID allerede er lagt til, og legger IKKE til ID og navn til i så fall.

				for (i in dataset[1].elementer){
					_employmentRates.push(dataset[1].elementer[i]);
					if (!_IDs.includes(dataset[1].elementer[i][KOMNR])){
						_IDs.push(dataset[1].elementer[i][KOMNR]);
						_names.push(i);
					}
				}

				// Tredje datasett (utdanning).
				// Her legger vi til alle info om utdanning.
				// Men vi sjekker om ID allerede er lagt til, og legger IKKE til ID og navn til i så fall.

				for (i in dataset[2].elementer){
					_education.push(dataset[2].elementer[i]);
					if (!_IDs.includes(dataset[2].elementer[i][KOMNR])){
						_IDs.push(dataset[2].elementer[i][KOMNR]);
						_names.push(i);
					}
				}

			}());

			// Oppretter alle kommuneobjektene, som vi samler i _all.
			// _all blir gjort offentlig tilgjengelige via funksjonen getAlleKommuner()
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
			return "Ingen tilgjengelige data.";
		}

		function getEmploymentRates(id){
			for (i in _employmentRates)
				if (_employmentRates[i][KOMNR] == id) return _employmentRates[i];
			return "Ingen tilgjengelige data.";
		}

		function getEducation(id){
			for (i in _education)
				if (_education[i][KOMNR] == id) return _education[i];
			return "Ingen tilgjengelige data.";
		}

		function loaded(){
			_loaded = true
		}

		function isLoaded(){
			return _loaded
		}

		return {
			// Følgende metoder blir tilgjengelige utenfor singleton:
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
			loaded: loaded,
			isLoaded: isLoaded,

		}
	}

	return {
		// For å unngå å potensielt skape flere singletons
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
			callback(xhr.responseText);
			// Uncomment to test for latency:
			//setTimeout(() => {callback(xhr.responseText);}, 2000);
		}
	};
	xhr.send();
}

var DataSet = function(urls) {
	this.urls = urls;
	this.onload = null;

	this.getNames = function() {
		return this.singleton.getAllNames();
	}

	this.getIDs = function() {
		return this.singleton.getAllIDs();
	}

	this.load = function() {
		if (this.data) return "Data is already loaded.";
		this.data = new Array();

		// Gi tilbakmelding om at den laster inn.
		//lastInn();

		var timer0 = performance.now();
		httpRequest(this.urls[0], (response0) => { 			// Befolkning
			httpRequest(this.urls[1], (response1) => { 		// Sysselsatte
				httpRequest(this.urls[2], (response2) => {	// Utdanning
					this.data.push(JSON.parse(response0, rmvUnused));
					this.data.push(JSON.parse(response1, rmvUnused));
					this.data.push(JSON.parse(response2, rmvUnused));

					var timer1 = performance.now();
					console.log(`All datasets are loaded. It took approximately: ${timer1-timer0} milliseconds.`);

					var t2 = performance.now();
					this.singleton = AlleKommunerSingleton.getInstance();
					this.singleton.setup(this.data);
					this.singleton.loaded();
					var t3 = performance.now();
					console.log(`Datasets are setup in Singleton. It took approximately: ${t3-t2} milliseconds.`);

					if (this.onload) {
						this.onload();
					}
					tabell(document.querySelector('.oversikt'), 'oversikt') // Konstruere oversiktstabell
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
		return this.singleton.getInfo(id);
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



	// INHABITANTS methods:

	getInhabitantsGenderByYear: function(gender, year) {
		return this.inhabitants[gender][year];
	},

	getInhabitants: function() {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return [];

		this.befolkningTotal = {};

		// Kontroller hvilke kjønn har flest målinger.
		this._biggest = Object.keys(this.inhabitants[MENN])
		if (Object.keys(this.inhabitants[KVINNER]).length > this._biggest.length) {
			for (year in this.inhabitants[KVINNER]){
				this.befolkningTotal[year] = this.inhabitants[MENN][year] + this.inhabitants[KVINNER][year];
			}
		} else {
			for (year in this.inhabitants[MENN]){
				this.befolkningTotal[year] = this.inhabitants[MENN][year] + this.inhabitants[KVINNER][year];
			}
		}

		console.log("BefolkningTotal: " + this.befolkningTotal);
		return this.befolkningTotal;
	},

	getInhabitantsLastYearTotal: function() {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return null;

		this.menn = this.inhabitants[MENN];
		this.kvinner = this.inhabitants[KVINNER];

		// Gå gjennom alle egenskapene i objektet, lagre alle keys i et array
		this.alleTallM = Object.keys(this.menn).sort();
		this.alleTallK = Object.keys(this.kvinner).sort();

		// Finner siste år i menn, ved å referere til lengden av alle tall - 1,
		// som tilsvarer siste element.
		this.sisteTallM = this.menn[this.alleTallM[this.alleTallM.length-1]];
		this.sisteTallK = this.kvinner[this.alleTallK[this.alleTallK.length-1]];

		return this.sisteTallM + this.sisteTallK;
	},

	getInhabitantsByGender: function(gender) {
		return this.inhabitants[gender];
	},

	// EMPLOYMENT methods:

	getEmploymentRates: function() {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return [];

		return this.employment[BEGGE];
	},

	getEmploymentRatesLastYear: function() {
		if (isContentInCategory(this.employment)) return [];

		this.emp = this.employment[BEGGE];
		this.empAllNumbers = Object.keys(this.employment[BEGGE]).sort();
		this.empLastNumber = this.emp[this.empAllNumbers[this.empAllNumbers.length-1]];
		return this.empLastNumber;
	},

	getEmploymentRatesByYear: function(year) {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return [];

		return this.employment[BEGGE][year];
	},

	getEmploymentRatesByGender: function(gender) {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return [];
		return this.employment[gender];
	},

	getEmploymentRatesByGenderAndYear: function(gender, year) {
		// Sjekk om det er noe tilgjengelige data,
		// return null om ikke.
		if (isContentInCategory(this.employment)) return [];
		return this.employment[gender][year];
	},


	// EDUCATION methods:

	getEduCodes() {
		const allCodes = ["01", "02a", "11", "03a", "04a", "09a"];
		return allCodes;
	},

	getEduName(eduCode) {
		const categories = {
			"01": "Grunnskolenivå",
	    	"02a": "Videregående skole-nivå",
	    	"11": "Fagskolenivå",
	    	"03a": "Universitets- og høgskolenivå kort",
	    	"04a": "Universitets- og høgskolenivå lang",
	     	"09a": "Uoppgitt eller ingen fullført utdanning"
    	};
    	return categories[eduCode];
	},

	getAllEducationRates() {
		const educodes = [
			GRUNNSKOLE,
			VGS,
			FAGSKOLE,
			UNIKORT,
			UNILANG,
			UTENUTD
		];
		let eduRates = {};
		for (num in educodes) {
			eduRates[educodes[num]] = this.education[educodes[num]];
		}
		return eduRates;
	},

	getEducationRatesLastYearSpecified: function(educode) {
		
		// Sjekk om vi har data på utdanning på kommunen.
		
		if (this.education == "Ingen tilgjengelige data."){
			this.edu == this.education;
			return;
		}

		this.edu = this.education[educode];
		this.eduMAllYears = Object.keys(this.edu[MENN]).sort();
		this.eduKAllYears = Object.keys(this.edu[KVINNER]).sort();
		this.eduLastYearM = this.edu[MENN][this.eduMAllYears[this.eduMAllYears.length-1]];
		this.eduLastYearK = this.edu[KVINNER][this.eduKAllYears[this.eduKAllYears.length-1]];

		return (this.eduLastYearM + this.eduLastYearK) / 2;
	},

	getEducationRates: function(edu){
		switch (edu) {
			case "grunnskole":
			case GRUNNSKOLE:
				return this.education[GRUNNSKOLE];
				break;
			case "VGS":
			case VGS:
				return this.education[VGS];
				break;
			case "fagskole":
			case FAGSKOLE:
				return this.education[FAGSKOLE];
				break;
			case "unikort":
			case UNIKORT:
				return this.education[UNIKORT];
				break;
			case "unilang":
			case UNILANG:
				return this.education[UNILANG];
				break;
			case "utenutdanning":
			case UTENUTD:
				return this.education[UTENUTD];
				break;
			default:
				return this.education;
				break;
		}

	}
}


var Kommuneobj = function(navn, id) {
	this.navn = navn;
	this.id = id;
	this.people = new People(id);
}

//Må gjøres penere
var ds = new DataSet(allUrls);
ds.load()
var l = AlleKommunerSingleton.getInstance()





